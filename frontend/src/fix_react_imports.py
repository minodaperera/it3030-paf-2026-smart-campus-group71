import os
import re

frontend_dir = r"d:\PAF\Smart_Campus\it3030-paf-2026-smart-campus-group71\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it already imports React (e.g. import React from 'react', import React, { useState })
    # This regex looks for 'import React' or 'import React,' or 'import * as React'
    if re.search(r'import\s+React\b', content):
        return

    # Add import React from "react"; at the top
    # We should place it before the first import or at the very top
    
    # Check if there are other react imports like import { useState } from 'react'
    # We could replace it, but adding a new line is safer.
    
    # Just prepend it.
    new_content = 'import React from "react";\n' + content
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated: {filepath}")

for root, dirs, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            # Only process jsx files or components
            if file.endswith('.jsx') or 'App' in file:
                process_file(os.path.join(root, file))

print("Done scanning and updating JSX files.")
