const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');

// We need to inject mapping logic before NextResponse.json
const mappingLogic = `
    // Parse skills and resources if they are strings (due to current DB schema)
    if (finalRoadmap && finalRoadmap.roadmap_versions) {
      finalRoadmap.roadmap_versions = finalRoadmap.roadmap_versions.map((version: any) => {
        if (version.roadmap_items) {
          version.roadmap_items = version.roadmap_items.map((item: any) => {
            
            // Helper to safely parse
            const parseArray = (val: any) => {
              if (Array.isArray(val)) return val;
              if (typeof val === 'string') {
                try {
                  return JSON.parse(val);
                } catch (e) {
                  // If it's a Postgres array literal {Python,Java} or plain string
                  const clean = val.replace(/^\{|\}$/g, '').trim();
                  return clean ? clean.split(',').map(s => s.trim()) : [];
                }
              }
              return [];
            };

            return {
              ...item,
              skills: parseArray(item.skills),
              resources: parseArray(item.resources)
            };
          });
        }
        return version;
      });
    }

    return NextResponse.json({ success: true, data: finalRoadmap, source: "generated" });
`;

content = content.replace(
    /return NextResponse\.json\(\{ success: true, data: finalRoadmap, source: "generated" \}\);/,
    mappingLogic.trim()
);

fs.writeFileSync('src/app/api/roadmap/generate/route.ts', content, 'utf8');
console.log("Updated route.ts with data-mapping fix.");