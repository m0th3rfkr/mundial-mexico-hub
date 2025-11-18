#!/bin/bash

# Fix all edge function TypeScript errors for error handling

# Fix all single-line edge functions (goodbarber KML functions)
find supabase/functions -name "index.ts" -type f -exec sed -i "s/\${error\.message}/\${error instanceof Error ? error.message : 'Unknown error'}/g" {} \;

echo "✅ Fixed all edge function error handling"
