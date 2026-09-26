const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

if (content.includes('import { useParams }')) {
    console.log("useParams fix is still there.");
} else {
    console.log("useParams fix was reverted.");
}