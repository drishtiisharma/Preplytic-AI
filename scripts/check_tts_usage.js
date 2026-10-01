const fs = require('fs');
function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next') && !file.includes('venv')) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.py') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}
const files = walk('.');
for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('GEMINI_TTS_MODEL') || content.includes('tts') || content.includes('generate_content')) {
        // Just checking if we can find how TTS is implemented
    }
}