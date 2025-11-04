#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

const N8N_BASE_URL = process.env.N8N_URL || 'https://mthrfkr.app.n8n.cloud';
const N8N_API_KEY = process.env.N8N_API_KEY;

class N8nMCPServer {
  constructor() {
    this.server = new Server(
      { name: 'n8n-mundial-server', version: '0.1.0' },
      { capabilities: { tools: {} } }
    );
    this.setupToolHandlers();
  }

  async makeN8nRequest(endpoint, method = 'GET', data = null) {
    const url = `${N8N_BASE_URL}/api/v1${endpoint}`;
    const options = {
      method,
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json',
      },
    };

    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_mundial_workflow',
          description: 'Create the Mundial 2026 ChatGPT-Supabase workflow',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', default: 'Mundial 2026 - Get Matches Today' }
            }
          },
        },
        {
          name: 'list_workflows',
          description: 'List all n8n workflows',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'test_workflow',
          description: 'Test workflow with sample data',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' }
            },
            required: ['workflowId']
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'create_mundial_workflow':
          return await this.createMundialWorkflow(request.params.arguments);
        case 'list_workflows':
          return await this.listWorkflows();
        case 'test_workflow':
          return await this.testWorkflow(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async createMundialWorkflow(args) {
    const workflowData = {
      name: args.name || 'Mundial 2026 - Get Matches Today',
      nodes: [
        {
          parameters: {
            httpMethod: 'POST',
            path: 'getMatchesToday',
            responseMode: 'responseNode'
          },
          id: 'webhook',
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300]
        },
        {
          parameters: {
            respondWith: 'json',
            responseBody: '={{ {"success": true, "message": "Workflow created! Configure Supabase credentials and activate."} }}'
          },
          id: 'respond',
          name: 'Respond',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [460, 300]
        }
      ],
      connections: {
        'Webhook': { main: [[{ node: 'Respond', type: 'main', index: 0 }]] }
      },
      active: false
    };

    try {
      const result = await this.makeN8nRequest('/workflows', 'POST', workflowData);
      return {
        content: [{
          type: 'text',
          text: `✅ Workflow created!\n\nID: ${result.id}\nName: ${result.name}\nWebhook: ${N8N_BASE_URL}/webhook/${result.id}/getMatchesToday\n\n⚠️ Next: Configure Supabase credentials in n8n`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `❌ Error: ${error.message}` }]
      };
    }
  }

  async listWorkflows() {
    try {
      const result = await this.makeN8nRequest('/workflows');
      const workflows = result.data || [];
      
      const list = workflows.map(w => 
        `• ${w.name} (${w.id}) - ${w.active ? '🟢' : '🔴'}`
      ).join('\n');

      return {
        content: [{
          type: 'text',
          text: `📋 Workflows (${workflows.length}):\n\n${list || 'No workflows found'}`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `❌ Error: ${error.message}` }]
      };
    }
  }

  async testWorkflow(args) {
    const testData = { function: 'getMatchesToday', date: '2025-11-04' };
    
    try {
      const result = await this.makeN8nRequest(`/workflows/${args.workflowId}/execute`, 'POST', testData);
      return {
        content: [{
          type: 'text',
          text: `🚀 Test executed!\n\nExecution ID: ${result.executionId}\nStatus: ${result.status}`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `❌ Error: ${error.message}` }]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('n8n MCP server running');
  }
}

const server = new N8nMCPServer();
server.run().catch(console.error);
