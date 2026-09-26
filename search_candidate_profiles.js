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
                if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    if (content.includes('CandidateProfile') || content.includes('candidate_profiles')) {
                        console.log(`Found candidate profile in: ${filePath}`);
                    }
                }
            }
        }
    } catch (e) {}
}
searchFiles('src');