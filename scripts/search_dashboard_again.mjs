import fs from 'fs';
import path from 'path';

function searchDashboard(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchDashboard(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('/dashboard')) {
                console.log(`Found '/dashboard' in: ${fullPath}`);
            }
        }
    }
}

searchDashboard('src');