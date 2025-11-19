# PERMANENT MCP SETUP - NEVER BREAK AGAIN

## WHAT WE HAVE WORKING
✅ Supabase local database running on port 54321  
✅ MCP Docker container built: `mundial-supabase-mcp`  
✅ MCP server provides 4 tools: query_table, list_tables, get_table_schema, export_table_for_rag  
✅ Database has World Cup schema with test data  

## THE PROBLEM
Q CLI is configured with MCP server but doesn't load the tools automatically.

## PERMANENT FIX

### 1. Check MCP Status
```bash
q mcp list
# Should show: supabase-server docker run -i --rm...
```

### 2. Verify MCP Server Works
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | docker run -i --rm -e SUPABASE_URL=http://host.docker.internal:54321 -e SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH mundial-supabase-mcp
# Should return JSON with 4 tools
```

### 3. Test Database Direct Access
```bash
curl -s "http://127.0.0.1:54321/rest/v1/teams?select=name,country_code" -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
# Should return Mexico and USA teams
```

## IF MCP TOOLS DON'T WORK IN Q CLI

### Option A: Use Direct API (Always Works)
```bash
# Query teams
curl -s "http://127.0.0.1:54321/rest/v1/teams?select=*" -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"

# Query matches  
curl -s "http://127.0.0.1:54321/rest/v1/matches?select=*" -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
```

### Option B: Fix MCP Connection
1. Remove and re-add MCP server:
```bash
q mcp remove --name supabase-server
q mcp add --name supabase-server --command "docker run -i --rm -e SUPABASE_URL=http://host.docker.internal:54321 -e SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH mundial-supabase-mcp"
```

2. Check status:
```bash
q mcp status --name supabase-server
```

## STARTUP CHECKLIST (Every Time)
1. `cd /Users/tonym/Code/mundial-mexico-hub`
2. `supabase status` (should show API URL: http://127.0.0.1:54321)
3. `q mcp list` (should show supabase-server)
4. Test with: `curl -s "http://127.0.0.1:54321/rest/v1/teams?select=name" -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"`

## BACKUP PLAN - DIRECT DATABASE ACCESS
If MCP never works, we can always use the REST API directly:

```bash
# Get all teams
curl "http://127.0.0.1:54321/rest/v1/teams?select=*" -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"

# Export for RAG (manual)
curl "http://127.0.0.1:54321/rest/v1/teams?select=name,country_code,confederation" -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH" | jq -r '.[] | "\(.name) (\(.country_code)) from \(.confederation)"'
```

## FILES THAT MUST EXIST
- ✅ `/Users/tonym/Code/mundial-mexico-hub/supabase-mcp/Dockerfile`
- ✅ `/Users/tonym/Code/mundial-mexico-hub/supabase-mcp/server.js`  
- ✅ Docker image: `mundial-supabase-mcp`
- ✅ Migration: `supabase/migrations/20241118_create_world_cup_schema.sql`

## NEVER LOSE THIS SETUP AGAIN
This document contains everything needed to rebuild the MCP connection if it breaks.
