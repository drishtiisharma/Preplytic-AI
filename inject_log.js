const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');
if (!content.includes('console.log("ITEMS TO INSERT:", itemsToInsert)')) {
    content = content.replace('const { error: itemsError } = await supabase', 'console.log("ITEMS TO INSERT:", itemsToInsert);\n    const { error: itemsError } = await supabase');
    fs.writeFileSync('src/app/api/roadmap/generate/route.ts', content, 'utf8');
}
console.log("Injected log.");