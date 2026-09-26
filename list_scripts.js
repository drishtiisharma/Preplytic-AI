const fs = require('fs');
function listFiles(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file.endsWith('.bat') || file.endsWith('.sh') || file.endsWith('.ps1')) {
            results.push(file);
        }
    });
    return results;
}
console.log(listFiles('.'));