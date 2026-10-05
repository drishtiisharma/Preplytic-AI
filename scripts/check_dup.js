const fs = require('fs');

console.log("=== API Route ===");
try {
    console.log(fs.readFileSync('src/app/api/report/generate/route.ts', 'utf8'));
} catch (e) {
    console.log("API read error:", e.message);
}

console.log("\n=== Page Component ===");
try {
    console.log(fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8'));
} catch (e) {
    console.log("Page read error:", e.message);
}