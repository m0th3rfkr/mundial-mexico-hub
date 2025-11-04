# n8n MCP Server Setup - Mundial 2026

## 📋 Overview
This document describes how to set up and use the n8n MCP (Model Context Protocol) server for the Mundial 2026 project. This integration allows you to manage n8n workflows directly from AI chat interfaces.

## 🏗 Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Chat       │───▶│   MCP Server    │───▶│   n8n Cloud     │
│   (Q CLI)       │    │   (Docker)      │    │   mthrfkr.app   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker installed
- n8n Cloud account (mthrfkr.app.n8n.cloud)
- n8n API key

### Installation
```bash
# Navigate to project
cd /Users/tonym/Code/mundial-mexico-hub/n8n-mcp

# Start the MCP server
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 📁 Project Structure
```
n8n-mcp/
├── package.json          # Node.js dependencies (ES modules)
├── Dockerfile            # Container configuration
├── docker-compose.yml    # Docker orchestration
└── server.js            # MCP server implementation
```

## ⚙️ Configuration

### Environment Variables
```yaml
# docker-compose.yml
environment:
  - N8N_URL=https://mthrfkr.app.n8n.cloud
  - N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Key Setup
1. Go to n8n Settings → API
2. Generate new API key
3. Update docker-compose.yml with your key

## 🛠 Available MCP Tools

### 1. `create_mundial_workflow`
Creates the Mundial 2026 ChatGPT-Supabase integration workflow.

**Input:**
```json
{
  "name": "Mundial 2026 - Get Matches Today"
}
```

**Output:**
- Workflow ID
- Webhook URL
- Setup instructions

### 2. `list_workflows`
Lists all workflows in your n8n instance.

**Output:**
- Workflow names and IDs
- Active/inactive status
- Total count

### 3. `test_workflow`
Executes a workflow with test data.

**Input:**
```json
{
  "workflowId": "workflow-id-here"
}
```

**Output:**
- Execution ID
- Status
- Results

## 🔧 Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose build --no-cache
docker-compose up -d
```

### Troubleshooting
```bash
# Check container status
docker-compose ps

# Enter container shell
docker-compose exec n8n-mcp-server sh

# View real-time logs
docker-compose logs --tail=50 -f
```

## 🌐 n8n Integration

### Workflow Creation Process
1. **MCP Tool Call**: `create_mundial_workflow`
2. **API Request**: POST to `/api/v1/workflows`
3. **Workflow Created**: Returns ID and webhook URL
4. **Manual Setup**: Configure Supabase credentials in n8n UI
5. **Activation**: Enable workflow in n8n interface

### Webhook Structure
```
https://mthrfkr.app.n8n.cloud/webhook/{workflow-id}/getMatchesToday
```

### Expected Payload
```json
{
  "function": "getMatchesToday",
  "date": "2025-11-04"
}
```

## 📊 Mundial 2026 Workflow

### Purpose
Create a webhook endpoint that ChatGPT can call to get today's football matches from Supabase.

### Components
1. **Webhook Trigger**: Receives ChatGPT requests
2. **Function Validator**: Ensures correct function call
3. **Supabase Query**: Fetches match data with team details
4. **Response Formatter**: Structures data for ChatGPT
5. **Webhook Response**: Returns formatted JSON

### Database Schema
```sql
-- Matches table
matches (
  id uuid,
  match_date timestamp,
  home_team_id uuid,
  away_team_id uuid,
  stadium text,
  city text,
  status text,
  home_score integer,
  away_score integer
)

-- Teams table  
teams (
  id uuid,
  name text,
  code text,
  flag text
)
```

### SQL Query
```sql
SELECT 
  m.id,
  m.match_date,
  m.stadium,
  m.city,
  m.status,
  m.home_score,
  m.away_score,
  home.name as home_team_name,
  home.code as home_team_code,
  home.flag as home_team_flag,
  away.name as away_team_name,
  away.code as away_team_code,
  away.flag as away_team_flag
FROM matches m
LEFT JOIN teams home ON m.home_team_id = home.id
LEFT JOIN teams away ON m.away_team_id = away.id
WHERE DATE(m.match_date) = $1
ORDER BY m.match_date ASC
```

## 🔐 Security Considerations

### API Key Management
- Store API keys in environment variables
- Never commit keys to version control
- Rotate keys regularly
- Use least-privilege access

### Network Security
- MCP server runs on localhost:3000
- Only accessible from local machine
- n8n API calls use HTTPS
- Webhook endpoints are public (by design)

## 🚨 Troubleshooting

### Common Issues

#### Container Keeps Restarting
```bash
# Check logs for errors
docker-compose logs

# Common causes:
# - Missing API key
# - Invalid n8n URL
# - ES module import errors
```

#### MCP Connection Failed
```bash
# Verify container is running
docker-compose ps

# Check if port 3000 is available
lsof -i :3000

# Restart services
docker-compose restart
```

#### n8n API Errors
```bash
# Verify API key is valid
curl -H "X-N8N-API-KEY: your-key" https://mthrfkr.app.n8n.cloud/api/v1/workflows

# Check n8n instance is accessible
ping mthrfkr.app.n8n.cloud
```

## 📈 Performance & Monitoring

### Resource Usage
- **Memory**: ~50MB per container
- **CPU**: Minimal (event-driven)
- **Network**: HTTPS API calls only
- **Storage**: Logs only

### Monitoring
```bash
# Container stats
docker stats mundial-n8n-mcp

# Log monitoring
docker-compose logs -f | grep ERROR

# Health check
curl -f http://localhost:3000/health || echo "Service down"
```

## 🔄 Updates & Maintenance

### Code Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Dependency Updates
```bash
# Update package.json
npm update

# Rebuild container
docker-compose build --no-cache
```

## 📝 Development Notes

### ES Modules Configuration
- `package.json` includes `"type": "module"`
- Uses `import` statements instead of `require`
- Compatible with MCP SDK requirements

### Error Handling
- All API calls wrapped in try-catch
- Meaningful error messages returned
- Container restarts on failure

### Logging
- Structured logging to stderr
- Docker captures and rotates logs
- Use `docker-compose logs` to view

## 🎯 Next Steps

### Immediate
1. Test MCP tools in AI chat
2. Create Mundial workflow
3. Configure Supabase credentials
4. Test ChatGPT integration

### Future Enhancements
1. Add more workflow templates
2. Implement workflow monitoring
3. Add batch operations
4. Create workflow backup/restore

## 📞 Support

### Resources
- **n8n Documentation**: https://docs.n8n.io/
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Docker Compose**: https://docs.docker.com/compose/

### Team Contacts
- **Developer**: Toño M. (@m0th3rfkr)
- **Project**: Mundial Mexico Hub
- **Repository**: https://github.com/m0th3rfkr/mundial-mexico-hub

## 📝 Notion Integration

### Setup Notion MCP Server
```bash
# Navigate to notion-mcp directory
cd /Users/tonym/Code/mundial-mexico-hub/notion-mcp

# Copy environment template
cp .env.example .env

# Edit .env with your Notion token
# NOTION_TOKEN=ntn_your_token_here

# Start Notion MCP server
docker-compose up -d
```

### Available Notion Tools
- `create_page` - Create new pages
- `update_page` - Update existing pages  
- `search_pages` - Search for pages
- `get_page_content` - Retrieve page content
- `add_comment` - Add comments to pages

### Upload Documentation to Notion
Once configured, you can use commands like:
```
Upload the n8n MCP setup documentation to Notion page "Mundial 2026 - Technical Docs"
```

---

**Last Updated**: November 4, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
