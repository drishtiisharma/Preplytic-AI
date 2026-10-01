const fs = require('fs');
if (fs.existsSync('supabase/migrations')) {
    const files = fs.readdirSync('supabase/migrations');
    files.forEach(file => {
        let content = fs.readFileSync('supabase/migrations/' + file, 'utf8');
        if (content.includes('CREATE TABLE')) {
            const lines = content.split('\n');
            for (let i=0; i<lines.length; i++) {
                if (lines[i].includes('CREATE TABLE')) {
                    console.log(lines[i]);
                }
            }
        }
    });
}