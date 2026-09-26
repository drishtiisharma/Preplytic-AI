const fs = require('fs');

function fixRouteParams(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(
        /\{ params \}: \{ params: \{ ([^}]+) \} \}/g,
        '{ params }: { params: Promise<{ $1 }> }'
    );
    // update inside function if needed
    content = content.replace(/const ([a-zA-Z_]+) = params\.([a-zA-Z_]+);/g, 'const { $2 } = await params;');
    // Or if it just uses params.id:
    if (content.includes('params.id') && !content.includes('await params.id')) {
        content = content.replace(/const roadmapId = params\.id;/g, 'const { id: roadmapId } = await params;');
    }
    if (content.includes('params.item_id') && !content.includes('await params.item_id')) {
        content = content.replace(/const itemId = params\.item_id;/g, 'const { item_id: itemId } = await params;');
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

fixRouteParams('src/app/api/roadmap/[id]/route.ts');
fixRouteParams('src/app/api/roadmap/[id]/sync-interview/route.ts');
fixRouteParams('src/app/api/roadmap/[id]/versions/route.ts');
fixRouteParams('src/app/api/roadmap/items/[item_id]/route.ts');

console.log("Fixed Next.js 15 route params types.");