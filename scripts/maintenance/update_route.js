const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');

// Add validation for phases > 0
const validationLogic = `
    if (!generatedRoadmap.phases || !Array.isArray(generatedRoadmap.phases) || generatedRoadmap.phases.length === 0) {
      throw new Error("Generated roadmap phases is missing or empty.");
    }
    
    const itemsToInsert = generatedRoadmap.phases.map((phase: any, index: number) => ({
      roadmap_version_id: versionInsert.id,
      title: phase.title,
      description: phase.description,
      week_start: phase.week_start,
      week_end: phase.week_end,
      priority: phase.priority,
      skills: phase.skills,
      resources: phase.resources,
      progress: 0,
      status: "not_started",
      order_index: index
    }));
    
    if (itemsToInsert.length === 0) {
      throw new Error("itemsToInsert is unexpectedly empty.");
    }
`;

content = content.replace(
    /const itemsToInsert = generatedRoadmap\.phases\.map\(\(phase: any\) => \(\{[\s\S]*?status: "not_started"\n\s*\}\)\);/,
    validationLogic.trim()
);

// Fix the cache logic to not return incomplete roadmaps (0 items)
content = content.replace(
    /if \(!isDummy\) \{\s*return NextResponse\.json\(\{ success: true, data: existingRoadmap, source: "cache" \}\);\s*\}/,
    `if (!isDummy) {
        const hasItems = existingRoadmap.roadmap_versions?.some((v: any) => v.roadmap_items && v.roadmap_items.length > 0);
        if (hasItems) {
            return NextResponse.json({ success: true, data: existingRoadmap, source: "cache" });
        }
      }`
);

fs.writeFileSync('src/app/api/roadmap/generate/route.ts', content, 'utf8');
console.log("Updated route.ts with order_index and validation.");