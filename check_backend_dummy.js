const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
if (content.includes('AI generation is disabled')) {
    console.log("Dummy text STILL exists in backend/main.py!");
} else {
    console.log("No dummy text in backend/main.py");
}