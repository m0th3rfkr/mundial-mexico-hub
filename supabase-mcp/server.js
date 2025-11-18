import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const server = new Server(
  {
    name: 'supabase-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'query_table',
        description: 'Query a Supabase table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name to query',
            },
            select: {
              type: 'string',
              description: 'Columns to select (default: *)',
              default: '*'
            },
            filter: {
              type: 'object',
              description: 'Filter conditions',
            },
            limit: {
              type: 'number',
              description: 'Limit results',
              default: 100
            }
          },
          required: ['table'],
        },
      },
      {
        name: 'list_tables',
        description: 'List all tables in the database',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_table_schema',
        description: 'Get schema for a specific table',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name',
            },
          },
          required: ['table'],
        },
      },
      {
        name: 'export_table_for_rag',
        description: 'Export table data formatted for RAG ingestion',
        inputSchema: {
          type: 'object',
          properties: {
            table: {
              type: 'string',
              description: 'Table name to export',
            },
            text_fields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to combine into text content',
            },
            metadata_fields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to include as metadata',
            }
          },
          required: ['table', 'text_fields'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_tables':
        const { data: tables, error: tablesError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
        
        if (tablesError) throw tablesError;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tables, null, 2),
            },
          ],
        };

      case 'get_table_schema':
        const { data: schema, error: schemaError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable')
          .eq('table_name', args.table)
          .eq('table_schema', 'public');
        
        if (schemaError) throw schemaError;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(schema, null, 2),
            },
          ],
        };

      case 'query_table':
        let query = supabase.from(args.table).select(args.select || '*');
        
        if (args.filter) {
          Object.entries(args.filter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        if (args.limit) {
          query = query.limit(args.limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };

      case 'export_table_for_rag':
        const { data: exportData, error: exportError } = await supabase
          .from(args.table)
          .select('*');
        
        if (exportError) throw exportError;
        
        const ragDocuments = exportData.map(row => {
          const textContent = args.text_fields
            .map(field => row[field])
            .filter(Boolean)
            .join(' - ');
          
          const metadata = {};
          if (args.metadata_fields) {
            args.metadata_fields.forEach(field => {
              if (row[field] !== undefined) {
                metadata[field] = row[field];
              }
            });
          }
          
          return {
            content: textContent,
            metadata: {
              ...metadata,
              table: args.table,
              id: row.id
            }
          };
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ragDocuments, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.log('Supabase MCP Server running');
