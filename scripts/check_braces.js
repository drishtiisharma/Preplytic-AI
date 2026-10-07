const fs = require('fs');
const lines = fs.readFileSync('src/app/globals.css', 'utf8').split('\n');

const fixedLines = [];
let braceCount = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{')) braceCount += (line.match(/\{/g) || []).length;
    if (line.includes('}')) {
        const lineBraces = (line.match(/\}/g) || []).length;
        if (braceCount < lineBraces) {
            console.log(`Removed unmatched } at line ${i + 1}`);
            braceCount = 0; // reset to prevent negative count issues
            continue; // Skip this line with extra brace
        }
        braceCount -= lineBraces;
    }
    fixedLines.push(line);
}

// Alternatively, let's just use regex to remove everything from `body { ... } html { ... } }` since it's redundant because my replacement already included body and html.