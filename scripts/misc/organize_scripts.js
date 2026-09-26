const fs = require('fs');
const path = require('path');

const dirs = [
    'scripts',
    'scripts/database',
    'scripts/backend',
    'scripts/frontend',
    'scripts/debug',
    'scripts/maintenance',
    'scripts/test',
    'scripts/misc'
];

dirs.forEach(d => {
    if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
    }
});

const files = fs.readdirSync('.');
const skipFiles = [
    'next.config.js', 'postcss.config.js', 'tailwind.config.js',
    'jest.config.js', 'babel.config.js', 'organize_scripts.js',
    'fix_page.js' // Active document is fix_page.js, maybe I shouldn't move it while it's open, but the user asked to clean root. I'll move everything.
];

let moved = 0;

for (const file of files) {
    if ((file.endsWith('.js') || file.endsWith('.py')) && !skipFiles.includes(file)) {
        const lower = file.toLowerCase();
        let target = 'scripts/misc';

        if (lower.startsWith('test_')) {
            target = 'scripts/test';
        } else if (lower.startsWith('fix_') || lower.startsWith('update_') || lower.startsWith('apply_') || lower.startsWith('restore_') || lower.startsWith('delete_') || lower.startsWith('inject_') || lower.startsWith('disable_')) {
            target = 'scripts/maintenance';
        } else if (lower.startsWith('check_') || lower.startsWith('find_') || lower.startsWith('read_') || lower.startsWith('search_') || lower.startsWith('inspect_') || lower.startsWith('verify_') || lower.startsWith('e2e_') || lower.startsWith('reproduce_') || lower.startsWith('list_') || lower.startsWith('print_')) {
            // Further categorize debug scripts by topic
            if (lower.includes('schema') || lower.includes('db') || lower.includes('sql') || lower.includes('insert') || lower.includes('col') || lower.includes('rls') || lower.includes('record')) {
                target = 'scripts/database';
            } else if (lower.includes('backend') || lower.includes('api') || lower.includes('route') || lower.includes('groq') || lower.includes('mistral') || lower.includes('gemini') || lower.includes('python')) {
                target = 'scripts/backend';
            } else if (lower.includes('frontend') || lower.includes('page') || lower.includes('ui') || lower.includes('nav') || lower.includes('component')) {
                target = 'scripts/frontend';
            } else {
                target = 'scripts/debug';
            }
        } else if (lower.startsWith('add_')) {
            if (lower.includes('endpoint')) target = 'scripts/backend';
            else if (lower.includes('roadmap')) target = 'scripts/database';
            else target = 'scripts/maintenance';
        } else if (lower.includes('schema') || lower.includes('db') || lower.includes('sql')) {
            target = 'scripts/database';
        } else if (lower.includes('backend') || lower.includes('api')) {
            target = 'scripts/backend';
        } else if (lower.includes('frontend') || lower.includes('page')) {
            target = 'scripts/frontend';
        }

        fs.renameSync(file, path.join(target, file));
        moved++;
    }
}
console.log(`Moved ${moved} scripts to scripts/`);