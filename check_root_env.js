const fs = require('fs');
if (fs.existsSync('.env')) {
    console.log(".env exists in root!");
    let content = fs.readFileSync('.env', 'utf8');
    content.split('\n').forEach(line => {
        let key = line.split('=')[0];
        if (key.trim()) console.log(key);
    });
} else {
    console.log(".env does NOT exist in root.");
}

if (fs.existsSync('.env.local')) {
    console.log(".env.local exists in root!");
}