const fs = require('fs');
function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.sql')) {
                results.push(file);
            }
        }
    });
    return results;
}
const files = walk('.');
for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('interview_questions')) {
        console.log(`Found in: ${file}`);
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('interview_questions')) {
                for (let j = Math.max(0, i-2); j < Math.min(lines.length, i+15); j++) {
                    console.log(lines[j]);
                }
                break; // Just need a snippet
            }
        }
    }
}