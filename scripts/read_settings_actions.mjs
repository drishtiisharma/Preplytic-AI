import fs from 'fs';
if (fs.existsSync('src/app/(app)/settings/actions.ts')) {
    console.log(fs.readFileSync('src/app/(app)/settings/actions.ts', 'utf8'));
} else {
    console.log("No actions.ts in settings");
}