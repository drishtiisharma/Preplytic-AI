const fs = require('fs');
if (fs.existsSync('package.json')) {
    let content = fs.readFileSync('package.json', 'utf8');
    let pkg = JSON.parse(content);
    console.log("package.json scripts:");
    console.log(pkg.scripts);
}