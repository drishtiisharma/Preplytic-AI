const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');

if (content.includes("resp.get('response_text', 'No answer')")) {
    content = content.replace("resp.get('response_text', 'No answer')", "resp.get('transcript', 'No answer')");
    fs.writeFileSync('backend/main.py', content, 'utf8');
    console.log("Updated backend report generation to use 'transcript' instead of 'response_text'!");
} else {
    console.log("No response_text found in backend/main.py");
}