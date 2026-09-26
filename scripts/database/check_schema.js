const fs = require('fs');
if (fs.existsSync('supabase/migrations')) {
    const files = fs.readdirSync('supabase/migrations');
    files.forEach(file => {
        let content = fs.readFileSync('supabase/migrations/' + file, 'utf8');
        if (content.includes('CREATE TABLE') && (content.includes('job_profiles') || content.includes('resume_records') || content.includes('interview_questions'))) {
            const lines = content.split('\n');
            let capture = false;
            let table = '';
            for (let i=0; i<lines.length; i++) {
                if (lines[i].includes('CREATE TABLE') && (lines[i].includes('job_profiles') || lines[i].includes('resume_records') || lines[i].includes('interview_questions'))) {
                    capture = true;
                    table = lines[i];
                    console.log(table);
                } else if (capture) {
                    console.log(lines[i]);
                    if (lines[i].includes(');')) capture = false;
                }
            }
        }
    });
}