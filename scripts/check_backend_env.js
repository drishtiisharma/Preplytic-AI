const fs = require('fs');
if (fs.existsSync('backend/.env')) {
    const lines = fs.readFileSync('backend/.env', 'utf8').split('\n');
    lines.forEach(line => {
        if (line.includes('SUPABASE')) {
            console.log(line);
        }
    });
}