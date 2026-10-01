const fs = require('fs');
function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.sql') || file.endsWith('.md')) {
                results.push(file);
            }
        }
    });
    return results;
}
const files = walk('.');
for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('CREATE POLICY') && content.includes('interview_questions')) {
        console.log(`Found RLS in: ${file}`);
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('interview_questions')) {
                console.log(lines[i]);
            }
        }
    }
}