const fs = require('fs');
function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next') && !file.includes('.git') && !file.includes('venv')) { 
            results = results.concat(walk(file));
        } else { 
            if (!stat.isDirectory()) {
                results.push(file);
            }
        }
    });
    return results;
}
const files = walk('.');
for (const file of files) {
    try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('postgresql://') || content.includes('postgres://') || content.includes('service_role')) {
            console.log(`Found string in: ${file}`);
        }
    } catch (e) {}
}