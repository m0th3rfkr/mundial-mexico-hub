#!/bin/bash
# Script para ejecutar el importador automáticamente

cd /Users/tonym/Code/mundial-mexico-hub/scripts

export SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaWlpZG52dGt0bG93bGh0ZWJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDgxMjEzMywiZXhwIjoyMDc2Mzg4MTMzfQ.z2qoL9pYqyFvYzO_wW-WRknxx-fo0Z7o69M-PezTOH0'

python3 import_espn_rss.py >> /tmp/rss_import.log 2>&1

echo "✅ Importación completada: $(date)" >> /tmp/rss_import.log
