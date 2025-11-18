#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const server = new Server(
  {
    name: 'notion-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'search_pages',
        description: 'Search for pages in Notion workspace',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_page_content',
        description: 'Get content of a specific page',
        inputSchema: {
          type: 'object',
          properties: {
            pageId: {
              type: 'string',
              description: 'Page ID',
            },
          },
          required: ['pageId'],
        },
      },
    ],
  };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_pages':
        const searchResults = await notion.search({
          query: args.query,
          filter: {
            property: 'object',
            value: 'page',
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(searchResults, null, 2),
            },
          ],
        };

      case 'get_page_content':
        const page = await notion.pages.retrieve({ page_id: args.pageId });
        const blocks = await notion.blocks.children.list({
          block_id: args.pageId,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ page, blocks }, null, 2),
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
console.error('Notion MCP Server running');
