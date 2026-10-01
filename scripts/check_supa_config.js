const fs = require('fs');
if (fs.existsSync('supabase/config.toml')) {
    const lines = fs.readFileSync('supabase/config.toml', 'utf8').split('\n');
    lines.forEach(line => {
        if (line.includes('port')) {
            console.log(line);
        }
    });
} else {
    console.log("No supabase config found");
}