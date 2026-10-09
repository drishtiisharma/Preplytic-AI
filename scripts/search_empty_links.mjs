import fs from 'fs';
import path from 'path';

function findEmptyLinks(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findEmptyLinks(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('href="#"')) {
                console.log(`Found href="#" in ${fullPath}`);
            }
            if (content.includes('href="#help"')) {
                console.log(`Found href="#help" in ${fullPath}`);
            }
        }
    }
}

findEmptyLinks('src');