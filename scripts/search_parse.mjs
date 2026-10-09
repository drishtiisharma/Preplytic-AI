import fs from 'fs';
import path from 'path';

function searchParse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchParse(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('parse-resume') || content.includes('parsed_data') || content.includes('extract')) {
                console.log(`Found in: ${fullPath}`);
            }
        }
    }
}

searchParse('src');