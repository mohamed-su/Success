import re

# Read the file
with open('dist/frontend/assets/index-DFKal6Pg.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all variations of BASE_URL
content = re.sub(r'\$\{BASE_URL\}', 'http://localhost:8081', content)
content = re.sub(r'%24%7BBASE_URL%7D', 'http://localhost:8081', content)
content = re.sub(r'\${BASE_URL}', 'http://localhost:8081', content)

# Write back
with open('dist/frontend/assets/index-DFKal6Pg.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("URLs replaced successfully!")