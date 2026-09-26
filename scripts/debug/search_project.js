const fs = require('fs');
const path = require('path');
function searchFiles(dir) {
    if (dir.includes('node_modules') || dir.includes('.next') || dir.includes('.git') || dir.includes('__pycache__')) return;
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                searchFiles(filePath);
            } else {
                const content = fs.readFileSync(filePath, 'utf8');
                if (content.includes('AI generation is disabled')) {
                    console.log(`FOUND IN ${filePath}`);
                }
            }
        }
    } catch (e) {}
}
searchFiles('.');