const fs = require('fs');

let mainContent = fs.readFileSync('backend/main.py', 'utf8');
mainContent = mainContent.replace('"dummy_roadmap": roadmap_data', '"roadmap": roadmap_data');
fs.writeFileSync('backend/main.py', mainContent, 'utf8');

let routeContent = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');

// Replace aiData.dummy_roadmap with aiData.roadmap
routeContent = routeContent.replace('const generatedRoadmap = aiData.dummy_roadmap;', 'const generatedRoadmap = aiData.roadmap;');

// Stringify focus_skills on insert
routeContent = routeContent.replace('focus_skills: generatedRoadmap.focus_skills,', 'focus_skills: JSON.stringify(generatedRoadmap.focus_skills),');

// Parse focus_skills for cache return
routeContent = routeContent.replace(
    /if \(existingRoadmap\) {\s*return NextResponse.json\({ success: true, data: existingRoadmap, source: "cache" }\);\s*}/,
    `if (existingRoadmap) {\n      if (typeof existingRoadmap.focus_skills === 'string') {\n        try { existingRoadmap.focus_skills = JSON.parse(existingRoadmap.focus_skills); } catch(e) {}\n      }\n      return NextResponse.json({ success: true, data: existingRoadmap, source: "cache" });\n    }`
);

// Parse focus_skills for generated return
routeContent = routeContent.replace(
    /return NextResponse.json\({ success: true, data: finalRoadmap, source: "generated" }\);/,
    `if (finalRoadmap && typeof finalRoadmap.focus_skills === 'string') {\n      try { finalRoadmap.focus_skills = JSON.parse(finalRoadmap.focus_skills); } catch(e) {}\n    }\n    return NextResponse.json({ success: true, data: finalRoadmap, source: "generated" });`
);

fs.writeFileSync('src/app/api/roadmap/generate/route.ts', routeContent, 'utf8');
console.log("Updated route.ts and main.py");