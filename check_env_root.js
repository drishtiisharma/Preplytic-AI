const fs = require('fs');
if (fs.existsSync('.env')) {
    let content = fs.readFileSync('.env', 'utf8');
    let lines = content.split('\n');
    for (let line of lines) {
        if (line.includes('SUPABASE')) {
            console.log(line.substring(0, line.indexOf('=') + 1) + "***");
        }
    }
} else {
    console.log(".env not found in root.");
}