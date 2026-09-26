const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');

// The helper function to sanitize roadmap_items
const helperCode = `
function sanitizeRoadmap(roadmap: any) {
  if (!roadmap || !roadmap.roadmap_versions) return roadmap;
  
  const parseArray = (val: any) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) {
        const clean = val.replace(/^\\{|\\}$/g, '').trim();
        return clean ? clean.split(',').map((s: string) => s.trim()) : [];
      }
    }
    return [];
  };

  roadmap.roadmap_versions = roadmap.roadmap_versions.map((version: any) => {
    if (version.roadmap_items) {
      version.roadmap_items = version.roadmap_items.map((item: any) => ({
        ...item,
        skills: parseArray(item.skills),
        resources: parseArray(item.resources)
      }));
    }
    return version;
  });
  return roadmap;
}
`;

// Insert the helper near validateRoadmap
if (!content.includes('function sanitizeRoadmap')) {
    content = content.replace('function validateRoadmap', helperCode.trim() + '\n\nfunction validateRoadmap');
}

// Fix cache return
content = content.replace(
    /return NextResponse\.json\(\{ success: true, data: existingRoadmap, source: "cache" \}\);/g,
    'return NextResponse.json({ success: true, data: sanitizeRoadmap(existingRoadmap), source: "cache" });'
);

// Fix generated return (replace my previous injected block)
const regex = /\/\/ Parse skills and resources[\s\S]*?return NextResponse\.json\(\{ success: true, data: finalRoadmap, source: "generated" \}\);/;
if (regex.test(content)) {
    content = content.replace(regex, 'return NextResponse.json({ success: true, data: sanitizeRoadmap(finalRoadmap), source: "generated" });');
}

fs.writeFileSync('src/app/api/roadmap/generate/route.ts', content, 'utf8');
console.log("Updated route.ts with sanitizeRoadmap helper for cache and generated flows.");