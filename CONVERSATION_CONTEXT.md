# Conversation Context - Supabase MCP Setup

## Project: WC2025 - Mundial de Fútbol 2026
- **Location**: `/Users/tonym/Code/mundial-mexico-hub`
- **Tech Stack**: Lovable (React) + Capacitor + Supabase + Airtable
- **Supabase Project ID**: `ksiiidnvtktlowlhtebs`

## Current Status
- ✅ Supabase CLI installed (v2.54.11 - outdated)
- ✅ Local Supabase running on:
  - API: http://127.0.0.1:54321
  - DB: postgresql://postgres:postgres@127.0.0.1:54322/postgres
  - Studio: http://127.0.0.1:54323
- ✅ Database has NO TABLES yet (empty public schema)

## Problem We Were Solving
**Objective**: Use Supabase MCP server to check/query Supabase tables via Q CLI

## Issue Found & Fixed
1. **Problem**: Supabase MCP container was in restart loop - crashing every 10 seconds
2. **Root Cause**: 
   - Missing Docker image (`mundial-supabase-mcp`)
   - Wrong network config (127.0.0.1 vs host.docker.internal)
   - Missing environment variables

3. **Solution Applied**:
   ```bash
   # Built the Docker image
   cd /Users/tonym/Code/mundial-mexico-hub/supabase-mcp
   docker build -t mundial-supabase-mcp .
   
   # Removed broken MCP config
   q mcp remove --name supabase-server
   
   # Added correct MCP config with env vars
   q mcp add --name supabase-server --command "docker run -i --rm -e SUPABASE_URL=http://host.docker.internal:54321 -e SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH mundial-supabase-mcp"
   ```

## Next Steps After Restart
1. **Verify MCP tools are loaded** - should see Supabase-specific tools available
2. **Check Supabase tables** using MCP tools
3. **Create database schema** for World Cup app if needed (teams, players, matches, etc.)

## Key Files
- **Supabase MCP Server**: `/Users/tonym/Code/mundial-mexico-hub/supabase-mcp/`
- **Project Config**: `/Users/tonym/Code/mundial-mexico-hub/supabase/config.toml`
- **Environment Template**: `/Users/tonym/Code/mundial-mexico-hub/.env.example`

## Supabase Connection Details
- **Local API Key**: `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH`
- **Local Secret**: `sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz`
- **Project ID**: `ksiiidnvtktlowlhtebs`

---
**Status**: Ready to restart conversation and test Supabase MCP tools
