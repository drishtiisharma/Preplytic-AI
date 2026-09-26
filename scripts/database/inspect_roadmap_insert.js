const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');
let lines = content.split('\n');
lines.forEach((l, i) => {
    if (l.includes('supabase.from("roadmaps")') || l.includes('supabase.from(\'roadmaps\')')) {
        for(let j=i-2; j<i+20; j++) {
            if(lines[j]) console.log(`Line ${j+1}: ${lines[j]}`);
        }
    }
});