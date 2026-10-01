const fs = require('fs');
if (fs.existsSync('backend/app.log')) {
    console.log("app.log:");
    const content = fs.readFileSync('backend/app.log', 'utf8');
    const lines = content.split('\n');
    console.log(lines.slice(-20).join('\n'));
} else if (fs.existsSync('backend/fastapi.log')) {
    console.log("fastapi.log:");
    const content = fs.readFileSync('backend/fastapi.log', 'utf8');
    const lines = content.split('\n');
    console.log(lines.slice(-20).join('\n'));
} else {
    console.log("No obvious log files found. Looking for .log files in backend...");
    console.log(fs.readdirSync('backend').filter(f => f.endsWith('.log')));
}