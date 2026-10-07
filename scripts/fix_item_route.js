const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/items/[item_id]/route.ts', 'utf8');

const regex = /\/\/ Verify ownership[\s\S]*?if \(itemUserId !== user\.id\) \{[\s\S]*?return NextResponse\.json\(\{ error: "Access denied" \}, \{ status: 403 \}\);\n\s*\}/;

if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync('src/app/api/roadmap/items/[item_id]/route.ts', content, 'utf8');
    console.log("Removed manual ownership check to fix 500 error on status update!");
} else {
    console.log("Regex not matched!");
}