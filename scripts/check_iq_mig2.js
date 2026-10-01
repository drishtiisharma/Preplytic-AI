const fs = require('fs');
if (fs.existsSync('supabase/migrations')) {
    const files = fs.readdirSync('supabase/migrations');
    files.forEach(file => {
        let content = fs.readFileSync('supabase/migrations/' + file, 'utf8');
        if (content.includes('interview_questions')) {
            console.log(`Found in: ${file}`);
            const lines = content.split('\n');
            for (let i=0; i<lines.length; i++) {
                if (lines[i].includes('interview_questions')) {
                    for (let j = Math.max(0, i-5); j < Math.min(lines.length, i+15); j++) {
                        console.log(lines[j]);
                    }
                    break;
                }
            }
        }
    });
}