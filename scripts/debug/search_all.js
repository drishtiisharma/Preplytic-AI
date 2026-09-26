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
                    const contentLower = content.toLowerCase();
                    if (contentLower.includes('durationminutes') || contentLower.includes('duration_minutes')) {
                        console.log(`Found in: ${filePath}`);
                        const lines = content.split('\n');
                        lines.forEach((l, i) => {
                            if (l.toLowerCase().includes('durationminutes') || l.toLowerCase().includes('duration_minutes')) {
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