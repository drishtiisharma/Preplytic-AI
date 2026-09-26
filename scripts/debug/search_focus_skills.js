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
                if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.py') || filePath.endsWith('.json') || filePath.endsWith('.sql')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('focus_skills')) {
                        console.log(`\nFound in: ${filePath}`);
                        const lines = content.split('\n');
                        lines.forEach((l, i) => {
                            if (l.includes('focus_skills')) {
                                console.log(`  Line ${i+1}: ${l.trim()}`);
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