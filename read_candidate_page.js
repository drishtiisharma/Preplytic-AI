const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/candidate/page.tsx', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('supabase') && l.includes('candidate_profiles')) {
        console.log(`Line ${i+1}: ${l.trim()}`);
    }
});