#!/usr/bin/env python3
"""
Fix all remaining localhost:5000 references in React components
Replace them with environment variable or production URL
"""

import os
import re
from pathlib import Path

# Production backend URL
PROD_URL = 'https://backend-xfp1.vercel.app/api'
API_CONFIG_IMPORT = "import { API_BASE_URL, BACKEND_URL } from '../config/apiConfig';"

def process_file(file_path):
    """Process a single file to remove localhost references"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Skip if already using API config
        if 'API_BASE_URL' in content or 'API_CONFIG' in content:
            return False
            
        # Skip markdown files and documentation
        if file_path.endswith('.md') or file_path.endswith('.json'):
            return False
        
        # Replace patterns
        replacements = [
            # const baseURL = "http://localhost:5000/api/projects"
            (r'const\s+baseURL\s*=\s*["\']http://localhost:\d+/api/projects["\'];?',
             "const baseURL = `${API_BASE_URL}/projects`;"),
            
            # const baseURL = "http://localhost:5000/api"
            (r'const\s+baseURL\s*=\s*["\']http://localhost:\d+/api["\'];?',
             "const baseURL = API_BASE_URL;"),
            
            # const url = "http://localhost:5000/api/projects"
            (r'const\s+url\s*=\s*["\']http://localhost:\d+/api/[^"\']+["\'];?',
             'const url = `${API_BASE_URL}` + url;'),
            
            # axios calls with http://localhost:5000
            (r'`http://localhost:\d+/api/([^`]+)`',
             r'`${API_BASE_URL}/\1`'),
            
            # Image URLs
            (r'`http://localhost:\d+\$\{',
             '`${BACKEND_URL}${'),
            
            # Direct string replacements as fallback
            ('http://localhost:5000/api', '${API_BASE_URL}'),
            ('http://localhost:5001/api', '${API_BASE_URL}'),
            ('http://localhost:5000', '${BACKEND_URL}'),
            ('http://localhost:5001', '${BACKEND_URL}'),
        ]
        
        for pattern, replacement in replacements:
            if pattern.startswith('http://'):
                # Literal string replacement
                content = content.replace(pattern, replacement)
            else:
                # Regex replacement
                content = re.sub(pattern, replacement, content)
        
        # Add import if we made changes and it doesn't exist
        if content != original_content:
            # Check if it's a React component (has import statements)
            if 'import' in content and 'API_BASE_URL' in content:
                # Check if already has the import
                if API_CONFIG_IMPORT not in content:
                    # Add import after existing imports
                    lines = content.split('\n')
                    import_end = 0
                    for i, line in enumerate(lines):
                        if line.startswith('import '):
                            import_end = i + 1
                    
                    if import_end > 0:
                        lines.insert(import_end, f"import {{ API_BASE_URL, BACKEND_URL }} from '{determine_import_path(file_path)}';\n")
                        content = '\n'.join(lines)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def determine_import_path(file_path):
    """Determine the relative import path for apiConfig"""
    # Count directory depth
    parts = file_path.replace('\\', '/').split('/')
    src_index = -1
    for i, part in enumerate(parts):
        if part == 'src':
            src_index = i
            break
    
    if src_index == -1:
        return '../config/apiConfig';
    
    remaining_parts = parts[src_index + 1:-1]  # exclude 'src' and filename
    depth = len(remaining_parts)
    
    if depth == 0:  # file is in src/
        return './config/apiConfig'
    else:
        return '../' * depth + 'config/apiConfig'

def main():
    """Main function to process all files"""
    src_path = Path('src')
    
    if not src_path.exists():
        print("Error: src directory not found!")
        return
    
    fixed_count = 0
    
    for jsx_file in src_path.rglob('*.jsx'):
        if process_file(str(jsx_file)):
            fixed_count += 1
            print(f"✓ Fixed: {jsx_file}")
    
    for js_file in src_path.rglob('*.js'):
        if process_file(str(js_file)):
            fixed_count += 1
            print(f"✓ Fixed: {js_file}")
    
    print(f"\n✅ Fixed {fixed_count} files!")

if __name__ == '__main__':
    main()
