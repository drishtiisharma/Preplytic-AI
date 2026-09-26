const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.next') || dir.includes('.venv')) return;
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                searchFiles(filePath);
            } else {
                if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.py')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.toLowerCase().includes('duration')) {
                        console.log(`Found in: ${filePath}`);
                        const lines = content.split('\n');
                        lines.forEach((l, i) => {
                            if (l.toLowerCase().includes('duration') && !l.toLowerCase().includes('transition-all') && !l.toLowerCase().includes('duration-')) {
                                console.log(`  Line ${i+1}: ${l}`);
                            }
                        });
                    }
                }
            }
        }
    } catch (e) {
        // Ignore read errors
    }
}
searchFiles('src');