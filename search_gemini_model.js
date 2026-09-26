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
                if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.py') || filePath.endsWith('.js') || filePath.endsWith('.md')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('gemini-2.5-flash')) {
                        console.log(`Found in: ${filePath}`);
                    }
                }
            }
        }
    } catch (e) {}
}
searchFiles('backend');
searchFiles('src');