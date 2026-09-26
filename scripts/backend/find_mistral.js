const fs = require('fs');
const path = require('path');
function searchFiles(dir) {
    if (dir.includes('node_modules') || dir.includes('__pycache__')) return;
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
                    if (content.includes('mistral_client')) {
                        console.log(`--- ${filePath} ---`);
                        let lines = content.split('\n');
                        lines.forEach((l, i) => {
                            if(l.includes('mistral_client')) console.log(`Line ${i+1}: ${l.trim()}`);
                        });
                    }
                }
            }
        }
    } catch (e) {}
}
searchFiles('backend');