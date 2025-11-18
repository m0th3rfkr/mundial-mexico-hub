import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

const server = new Server(
  {
    name: 'n8n-mcp-server',
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
        name: 'list_workflows',
        description: 'List all n8n workflows',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_workflow',
        description: 'Get workflow details',
        inputSchema: {
          type: 'object',
          properties: {
            workflowId: {
              type: 'string',
              description: 'Workflow ID',
            },
          },
          required: ['workflowId'],
        },
      },
      {
        name: 'execute_workflow',
        description: 'Execute a workflow',
        inputSchema: {
          type: 'object',
          properties: {
            workflowId: {
              type: 'string',
              description: 'Workflow ID',
            },
            data: {
              type: 'object',
              description: 'Input data for workflow',
            },
          },
          required: ['workflowId'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const headers = {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json',
    };

    switch (name) {
      case 'list_workflows':
        const response = await axios.get(`${N8N_URL}/api/v1/workflows`, { headers });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };

      case 'get_workflow':
        const workflow = await axios.get(`${N8N_URL}/api/v1/workflows/${args.workflowId}`, { headers });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(workflow.data, null, 2),
            },
          ],
        };

      case 'execute_workflow':
        const execution = await axios.post(
          `${N8N_URL}/api/v1/workflows/${args.workflowId}/execute`,
          args.data || {},
          { headers }
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(execution.data, null, 2),
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
console.log('n8n MCP Server running');
