# 🚀 CONTEXT: Supabase RAG Integration - Mundial 2026 Project

## 📋 CURRENT STATUS
We successfully configured **Supabase MCP server** for Amazon Q CLI to access your Mundial 2026 database directly.

## 🎯 WHAT WE'RE DOING
**Goal**: Migrate your existing Supabase data to RAG vector store for your n8n chatbot workflow.

## 🔧 SETUP COMPLETED
✅ **Supabase MCP Server**: `mundial-supabase-mcp` container running  
✅ **Q CLI Integration**: `supabase-server` MCP configured  
✅ **n8n RAG Workflow**: Already has Supabase Vector Store setup  
✅ **Database**: `ksiiidnvtktlowlhtebs.supabase.co` with tourism data  

## 📊 YOUR DATA STRUCTURE
**7 Tourist Corridors CDMX:**
- 🌹 Zona Rosa, ⛪ Basílica, 🎨 Coyoacán, 🎺 Garibaldi  
- 🚤 Xochimilco, 🏛️ Centro Histórico, 🌳 Chapultepec

**Each corridor has 5 categories:**
- 🏛️ Tourist attractions, 🍴 Restaurants, 🅿️ Parking, 🚴 Ecobici, 🏨 Hotels

## 🛠 AVAILABLE TOOLS (after restart)
- `list_tables` - See all Supabase tables
- `query_table` - Query specific tables  
- `get_table_schema` - See table structure
- `export_table_for_rag` - Export data formatted for RAG

## 🎯 NEXT STEPS
1. **Review your Supabase tables** and data structure
2. **Export tourism data** in RAG-friendly format
3. **Upload to n8n RAG workflow** via chat interface
4. **Test chatbot** with semantic search queries

## 🔗 KEY INFO
- **Supabase URL**: `https://ksiiidnvtktlowlhtebs.supabase.co`
- **n8n Workflow**: `https://mthrfkr.app.n8n.cloud/workflow/gRuvxbdyKAvakaRY`
- **Project**: Mundial 2026 CDMX Host City Guide for Televisa

## 💡 CONTEXT
Your n8n workflow has both:
- **HTTP tool** (`consultar_supabase`) - for structured database queries
- **Supabase Vector Store** - for RAG semantic search

We're keeping both tools and populating the RAG store with your existing data.

---
**Ready to continue with Supabase data migration to RAG! 🚀**
