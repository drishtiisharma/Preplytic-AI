import fs from 'fs';
import path from 'path';

function searchMatchScore(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchMatchScore(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('Overall Match Score') || content.includes('View Match Insights vs Jobs')) {
                console.log(`Found in: ${fullPath}`);
            }
        }
    }
}

searchMatchScore('src');