const fs = require('fs');

let routeContent = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');

// 1. Revert JSON.stringify on insert
routeContent = routeContent.replace(
    /focus_skills: JSON\.stringify\(generatedRoadmap\.focus_skills\),/g,
    'focus_skills: generatedRoadmap.focus_skills,'
);

// 2. Revert JSON.parse on cache return
routeContent = routeContent.replace(
    /if \(existingRoadmap\) {\s*if \(typeof existingRoadmap\.focus_skills === 'string'\) {\s*try { existingRoadmap\.focus_skills = JSON\.parse\(existingRoadmap\.focus_skills\); } catch\(e\) {}\s*}\s*return NextResponse\.json\({ success: true, data: existingRoadmap, source: "cache" }\);\s*}/g,
    `if (existingRoadmap) {
      const isDummy = existingRoadmap.summary?.includes('AI generation is disabled') || 
                      (Array.isArray(existingRoadmap.focus_skills) && existingRoadmap.focus_skills.includes('Pending AI Generation')) || 
                      (typeof existingRoadmap.focus_skills === 'string' && existingRoadmap.focus_skills.includes('Pending AI Generation'));
      
      if (!isDummy) {
        return NextResponse.json({ success: true, data: existingRoadmap, source: "cache" });
      }
      // Delete dummy so we can replace it cleanly
      await supabase.from('roadmaps').delete().eq('id', existingRoadmap.id);
    }`
);

// 3. Revert JSON.parse on generated return
routeContent = routeContent.replace(
    /if \(finalRoadmap && typeof finalRoadmap\.focus_skills === 'string'\) {\s*try { finalRoadmap\.focus_skills = JSON\.parse\(finalRoadmap\.focus_skills\); } catch\(e\) {}\s*}\s*return NextResponse\.json\({ success: true, data: finalRoadmap, source: "generated" }\);/g,
    `return NextResponse.json({ success: true, data: finalRoadmap, source: "generated" });`
);

fs.writeFileSync('src/app/api/roadmap/generate/route.ts', routeContent, 'utf8');
console.log("Updated route.ts successfully.");