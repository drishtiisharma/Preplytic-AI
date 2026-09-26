const fs = require('fs');
const path = require('path');
function searchFiles(dir) {
    if (dir.includes('node_modules') || dir.includes('.next')) return;
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                searchFiles(filePath);
            } else {
                if (filePath.endsWith('.ts') && (file.includes('types') || file.includes('database'))) {
                    console.log(filePath);
                }
            }
        }
    } catch (e) {}
}
searchFiles('src');