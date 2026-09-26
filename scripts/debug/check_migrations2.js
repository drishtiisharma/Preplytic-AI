const fs = require('fs');
if (fs.existsSync('supabase/migrations')) {
    const files = fs.readdirSync('supabase/migrations');
    for (const file of files) {
        console.log(`--- ${file} ---`);
        const content = fs.readFileSync('supabase/migrations/' + file, 'utf8');
        let lines = content.split('\n');
        for (let l of lines) {
            if (l.toLowerCase().includes('policy') && l.includes('roadmap')) {
                console.log(l.trim());
            }
        }
    }
}