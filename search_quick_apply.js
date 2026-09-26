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
                    if (content.includes('handleGenerateColdMail') || content.includes('handleGenerateReferral')) {
                        console.log(`\nFound in: ${filePath}`);
                        const lines = content.split('\n');
                        lines.forEach((l, i) => {
                            if (l.includes('handleGenerateColdMail') || l.includes('handleGenerateReferral') || l.includes('Failed to generate')) {
                                console.log(`  Line ${i+1}: ${l.trim()}`);
                            }
                        });
                    }
                }
            }
        }
    } catch (e) {
    }
}
searchFiles('.');