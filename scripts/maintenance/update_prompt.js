const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');

// Update the system prompt to explicitly require phases
content = content.replace(
    /IMPORTANT: The 'resources' array for each phase MUST be empty \[\]\./g,
    "IMPORTANT: You MUST generate at least 3-4 phases. The 'resources' array inside each phase MUST be empty []."
);

fs.writeFileSync('backend/main.py', content, 'utf8');
console.log("Updated backend/main.py prompt to require phases.");