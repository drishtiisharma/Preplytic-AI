const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
if (!content.includes('import json')) {
    content = content.replace('import os\n', 'import os\nimport json\n');
    fs.writeFileSync('backend/main.py', content, 'utf8');
    console.log("Injected import json");
} else {
    // If it's imported later, let's just move it to the top.
    let lines = content.split('\n');
    let hasJsonAtTop = false;
    for(let i=0; i<10; i++) {
        if(lines[i].includes('import json')) hasJsonAtTop = true;
    }
    if(!hasJsonAtTop) {
        content = content.replace('import os\n', 'import os\nimport json\n');
        fs.writeFileSync('backend/main.py', content, 'utf8');
        console.log("Injected import json at the top");
    } else {
        console.log("Already has import json at the top");
    }
}