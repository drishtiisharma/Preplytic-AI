const fs = require('fs');
const path = require('path');
let found = false;
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
                if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('supabase.from(\'profiles\')')) {
                        console.log(`Found profiles fetch in: ${filePath}`);
                        found = true;
                    }
                }
            }
        }
    } catch (e) {}
}
searchFiles('src');
if (!found) console.log("No profiles fetch found.");