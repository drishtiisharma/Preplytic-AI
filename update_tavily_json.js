const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

// Update backend to save json strings instead of formatted text
content = content.replace(
    /phase\["resources"\].append\(f"\{title\} - \{url\} \(\{desc\}\)"\)/g,
    'phase["resources"].append(json.dumps({"title": title, "url": url, "description": desc}))'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated main.py to store resources as JSON strings");