const fs = require('fs');
if (fs.existsSync('src/app/api/stt/route.ts')) {
    console.log(fs.readFileSync('src/app/api/stt/route.ts', 'utf8'));
} else {
    console.log("File not found.");
}