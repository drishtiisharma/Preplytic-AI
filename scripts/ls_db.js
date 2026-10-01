const fs = require('fs');
if (fs.existsSync('scripts/database')) {
    console.log(fs.readdirSync('scripts/database').join('\n'));
}