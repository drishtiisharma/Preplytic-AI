const fs = require('fs');
let path = 'src/app/api/roadmap/[id]/sync-interview/route.ts';
let content = fs.readFileSync(path, 'utf8');

// The outer try block is missing its catch because it was commented out.
// We need to uncomment the outer catch.
content = content.replace(/\/\/   } catch \(error: any\) \{/g, '  } catch (error: any) {');
content = content.replace(/\/\/     console\.error\("Roadmap interview sync error:", error\);/g, '    console.error("Roadmap interview sync error:", error);');
content = content.replace(/\/\/     return NextResponse\.json\(\{ error: "Internal Server Error", details: error\.message \}, \{ status: 500 \}\);/g, '    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });');
content = content.replace(/\/\/   \}/g, '  }');

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed outer catch block in sync-interview");