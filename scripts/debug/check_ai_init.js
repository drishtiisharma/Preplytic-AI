const fs = require('fs');
if (fs.existsSync('backend/ai/__init__.py')) {
    let content = fs.readFileSync('backend/ai/__init__.py', 'utf8');
    console.log("ai/__init__.py contents:");
    console.log(content);
} else {
    console.log("No ai/__init__.py");
}