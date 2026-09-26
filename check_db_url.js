const fs = require('fs');
let envs = [
    fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '',
    fs.existsSync('backend/.env') ? fs.readFileSync('backend/.env', 'utf8') : '',
    fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : ''
].join('\n');

for (let line of envs.split('\n')) {
    if (line.includes('DATABASE_URL') || line.includes('POSTGRES')) {
        console.log(line);
    }
}