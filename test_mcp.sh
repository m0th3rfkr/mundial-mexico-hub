#!/bin/bash
# Quick MCP Test Script

echo "=== TESTING MCP SETUP ==="

echo "1. Checking Supabase status..."
supabase status | grep "API URL"

echo "2. Checking MCP configuration..."
q mcp list | grep supabase-server

echo "3. Testing database direct access..."
curl -s "http://127.0.0.1:54321/rest/v1/teams?select=name,country_code" \
  -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH" | head -2

echo "4. Testing MCP server tools..."
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}' | \
docker run -i --rm \
  -e SUPABASE_URL=http://host.docker.internal:54321 \
  -e SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH \
  mundial-supabase-mcp 2>/dev/null | grep -o '"name":"[^"]*"' | head -4

echo "=== TEST COMPLETE ==="
