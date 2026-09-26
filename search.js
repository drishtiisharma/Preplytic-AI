const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.next')) return;
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                searchFiles(filePath);
            } else {
                if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.py') || filePath.endsWith('.json') || filePath.endsWith('.js') || filePath.endsWith('.md')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('duration_minutes')) {
                        console.log(`Found in: ${filePath}`);
                        const lines = content.split('\n');
                        lines.forEach((l, i) => {
                            if (l.includes('duration_minutes')) {
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
searchFiles('.');