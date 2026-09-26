const fs = require('fs');
if (fs.existsSync('src/app/(app)/interview/[sessionId]/report/page.tsx')) {
    let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8');
    if (content.includes('fetch("http://localhost:8000/generate/interview-report"')) {
        console.log("Report generation endpoint is called in report page.");
    } else {
        console.log("Report generation endpoint NOT explicitly found.");
    }
}