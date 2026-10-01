const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');
const match = content.match(/const response = await fetch\("http:\/\/localhost:8000\/generate\/interview-questions"[\s\S]*?if \(!response\.ok\) \{[\s\S]*?\}[\s\S]*?const aiData = await response\.json\(\);/);
if (match) {
    console.log(match[0]);
} else {
    console.log("Could not find the fetch block.");
}