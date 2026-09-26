const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');
let match = content.match(/supabase\.from\(["']roadmaps["']\)\.insert\([\s\S]*?\)/);
if(match) console.log(match[0]);
else console.log("Not found direct insert, searching for object");

let objMatch = content.match(/const roadmapRecord = \{[\s\S]*?\};/);
if (objMatch) console.log(objMatch[0]);