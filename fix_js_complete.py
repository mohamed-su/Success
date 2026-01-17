import re

# Read the broken file
with open('dist/frontend/assets/index-DFKal6Pg.js.broken', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace ALL possible variations of BASE_URL
replacements = [
    (r'\$\{BASE_URL\}', 'http://localhost:8081'),
    (r'%24%7BBASE_URL%7D', 'http://localhost:8081'),
    (r'\${BASE_URL}', 'http://localhost:8081'),
    (r'`\$\{BASE_URL\}`', '"http://localhost:8081"'),
    (r'encodeURIComponent\(`\$\{BASE_URL\}`\)', '"http://localhost:8081"'),
    (r'encodeURIComponent\(\$\{BASE_URL\}\)', '"http://localhost:8081"'),
]

for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

# Write the fixed file
with open('dist/frontend/assets/index-DFKal6Pg.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("File completely fixed!")