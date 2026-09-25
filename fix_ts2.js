const fs = require('fs');

function fixRoadmapItemPriority() {
    let p = 'src/app/(app)/roadmap/page.tsx';
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/type RoadmapItem = \{.*?\};/g, 'type RoadmapItem = { id: string; title: string; description: string; week_start: number; week_end: number; progress: number; status: string; skills: string[]; resources: string[]; priority?: string; };');
    fs.writeFileSync(p, c);
}
fixRoadmapItemPriority();
console.log("Fixed roadmap item priority");