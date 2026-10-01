const fs = require('fs');
if (fs.existsSync('supabase/migrations')) {
    const files = fs.readdirSync('supabase/migrations');
    files.forEach(file => {
        let content = fs.readFileSync('supabase/migrations/' + file, 'utf8');
        if (content.includes('CREATE TABLE') && content.includes('candidate_profiles')) {
            const lines = content.split('\n');
            let capture = false;
            for (let i=0; i<lines.length; i++) {
                if (lines[i].includes('CREATE TABLE IF NOT EXISTS public.candidate_profiles')) capture = true;
                if (capture) {
                    console.log(lines[i]);
                    if (lines[i].includes(');')) capture = false;
                }
            }
        }
    });
}