const fs = require('fs');
if (fs.existsSync('src/app/api/report/generate/route.ts')) {
    let content = fs.readFileSync('src/app/api/report/generate/route.ts', 'utf8');
    if (content.includes('/generate/interview-report')) {
        console.log("Report generation endpoint is called in Next.js API.");
    } else {
        console.log("Not called in API either.");
    }
}