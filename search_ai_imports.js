const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
    if (dir.includes('node_modules') || dir.includes('.venv')) return;
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                searchFiles(filePath);
            } else {
                if (filePath.endsWith('.py')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('ai.clients') || content.includes('ai.config') || content.includes('import ai')) {
                        console.log(`Found in: ${filePath}`);
                    }
                }
            }
        }
    } catch (e) {
    }
}
searchFiles('backend');