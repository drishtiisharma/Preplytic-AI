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
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.py')) {
                results.push(file);
            }
        }
    });
    return results;
}
const files = walk('src');
for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('resume_data') || content.includes('resume_text') || content.includes('resumeData') || content.includes('parsed_content')) {
        console.log(`Found resume data reference in: ${file}`);
    }
}