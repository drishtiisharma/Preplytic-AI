const fs = require('fs');
['.env.local', 'backend/.env'].forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`--- ${file} ---`);
        let lines = fs.readFileSync(file, 'utf8').split('\n');
        lines.forEach(l => {
            if (l.includes('DB') || l.includes('POSTGRES')) console.log(l.trim());
        });
    }
});