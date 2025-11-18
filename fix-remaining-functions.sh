#!/bin/bash

# Fix all remaining single-line edge functions with TypeScript errors
cd supabase/functions

for dir in goodbarber-*-kml/; do
  if [ -f "$dir/index.ts" ]; then
    sed -i 's/\${error\.message}/\${error instanceof Error ? error.message : "Unknown error"}/g' "$dir/index.ts"
    echo "Fixed: $dir/index.ts"
  fi
done

echo "✅ All edge functions fixed!"
