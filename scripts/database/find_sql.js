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
                if (filePath.endsWith('.sql')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('roadmap_versions')) {
                        console.log(`Found in: ${filePath}`);
                        let lines = content.split('\n');
                        lines.forEach(l => {
                            if(l.toLowerCase().includes('policy')) console.log(l.trim());
                        });
                    }
                }
            }
        }
    } catch (e) {}
}
searchFiles('.');