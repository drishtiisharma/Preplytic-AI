import fs from 'fs';
import path from 'path';

function searchHashLinks(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchHashLinks(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Look for href="#" or href="#something" but exclude href="/#something" since those are absolute
            const matches = content.match(/href="[^"]*#[^"]*"/g) || [];
            matches.forEach(match => {
                if (match === 'href="#"' || match.startsWith('href="#')) {
                    console.log(`Found relative/empty hash ${match} in ${fullPath}`);
                }
            });
        }
    }
}

searchHashLinks('src');