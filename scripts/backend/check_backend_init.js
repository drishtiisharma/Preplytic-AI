const fs = require('fs');
if (fs.existsSync('backend/__init__.py')) {
    let content = fs.readFileSync('backend/__init__.py', 'utf8');
    console.log("backend/__init__.py contents:");
    console.log(content);
} else {
    console.log("No backend/__init__.py");
}