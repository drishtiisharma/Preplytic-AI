const fs = require('fs');
let path = 'src/app/api/roadmap/[id]/sync-interview/route.ts';
let content = fs.readFileSync(path, 'utf8');

// The file should look like:
// ...
// return NextResponse.json({ success: true, analysis: generatedAnalysis });
// } catch (error: any) { ... }
// /*
// const { data: versionInsert ...
// ...
// */
// }
// If there is any trailing `*/\n}`, I'll remove it and properly comment the rest.

let lines = content.split('\n');
let inCommentBlock = false;
let catchIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('} catch (error: any) {') && lines[i-1].includes('return NextResponse.json({ success: true, analysis: generatedAnalysis });')) {
        catchIndex = i + 2; // skip catch and its closing bracket
        break;
    }
}

if (catchIndex !== -1) {
    for(let i = catchIndex + 1; i < lines.length - 1; i++) {
        if (!lines[i].startsWith('//')) {
            lines[i] = '// ' + lines[i];
        }
    }
}
fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log("Fixed comments in sync-interview");