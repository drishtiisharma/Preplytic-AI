import fs from 'fs';
import path from 'path';

function searchAvatar(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchAvatar(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.toLowerCase().includes('avatar') && content.toLowerCase().includes('upload')) {
                console.log(`Found avatar upload logic in: ${fullPath}`);
            }
        }
    }
}

searchAvatar('src');