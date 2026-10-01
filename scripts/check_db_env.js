const fs = require('fs');
if (fs.existsSync('.env.local')) {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    lines.forEach(line => {
        if (line.includes('DATABASE_URL') || line.includes('POSTGRES_URL')) {
            console.log(line);
        }
    });
}
if (fs.existsSync('backend/.env')) {
    const lines = fs.readFileSync('backend/.env', 'utf8').split('\n');
    lines.forEach(line => {
        if (line.includes('DATABASE_URL') || line.includes('POSTGRES_URL')) {
            console.log(line);
        }
    });
}