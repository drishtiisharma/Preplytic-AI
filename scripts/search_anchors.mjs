import fs from 'fs';
import path from 'path';

function findAnchors(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findAnchors(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(/#(contact|features|how-it-works|about|faq)/g);
            if (matches) {
                console.log(`Found in ${fullPath}: ${[...new Set(matches)].join(', ')}`);
            }
        }
    }
}

findAnchors('src');