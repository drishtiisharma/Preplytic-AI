const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('         prompt += f"\r\nInclude a reference', '         prompt += f"\\nInclude a reference');
content = content.replace('         prompt += f"\nInclude a reference', '         prompt += f"\\nInclude a reference');

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed referral message quotes correctly");