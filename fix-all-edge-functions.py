#!/usr/bin/env python3
import os
import re

# Find all index.ts files in supabase/functions
functions_dir = 'supabase/functions'

for root, dirs, files in os.walk(functions_dir):
    for file in files:
        if file == 'index.ts':
            file_path = os.path.join(root, file)
            
            # Read the file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace error.message with proper error handling
            # Pattern 1: ${error.message} in template strings
            content = re.sub(
                r'\$\{error\.message\}',
                '${error instanceof Error ? error.message : \'Unknown error\'}',
                content
            )
            
            # Write the file back
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f'Fixed: {file_path}')

print('\n✅ All edge functions fixed!')
