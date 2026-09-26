const fs = require('fs');

function fixId(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/const \{ id \} = await params;/g, 'const { id: roadmapId } = await params;');
    fs.writeFileSync(filePath, content, 'utf8');
}
function fixItemId(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/const \{ item_id \} = await params;/g, 'const { item_id: itemId } = await params;');
    fs.writeFileSync(filePath, content, 'utf8');
}

fixId('src/app/api/roadmap/[id]/route.ts');
fixId('src/app/api/roadmap/[id]/sync-interview/route.ts');
fixId('src/app/api/roadmap/[id]/versions/route.ts');
fixItemId('src/app/api/roadmap/items/[item_id]/route.ts');

console.log("Fixed param destructuring names.");