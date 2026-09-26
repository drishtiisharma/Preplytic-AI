const fs = require('fs');
if (fs.existsSync('supabase/migrations')) {
    const files = fs.readdirSync('supabase/migrations');
    for (const file of files) {
        const content = fs.readFileSync('supabase/migrations/' + file, 'utf8');
        if (content.includes('roadmap_versions')) {
            console.log(`--- ${file} ---`);
            let lines = content.split('\n');
            let printing = false;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].toLowerCase().includes('policy') && lines[i].includes('roadmap_versions')) {
                    printing = true;
                }
                if (printing) {
                    console.log(lines[i].trim());
                    if (lines[i].includes(';')) printing = false;
                }
            }
        }
    }
} else {
    console.log("No supabase/migrations directory found.");
}