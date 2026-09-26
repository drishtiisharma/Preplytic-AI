const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');
if (content.includes('AI generation is disabled')) {
    console.log("FOUND DUMMY IN ROUTE.TS");
} else {
    console.log("Not found in route.ts");
}