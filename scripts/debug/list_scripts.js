const fs = require('fs');
const files = fs.readdirSync('.');
const scripts = files.filter(f => f.endsWith('.js') || f.endsWith('.py'));
for (const script of scripts) {
    if (fs.statSync(script).isFile()) {
        console.log(script);
    }
}