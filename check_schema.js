const fs = require('fs');
if (fs.existsSync('schema.sql')) {
    console.log("schema.sql found!");
    const content = fs.readFileSync('schema.sql', 'utf8');
    let lines = content.split('\n');
    lines.forEach(l => {
        if(l.toLowerCase().includes('policy') && l.includes('roadmap_versions')) console.log(l.trim());
    });
} else if (fs.existsSync('supabase/schema.sql')) {
    console.log("supabase/schema.sql found!");
} else {
    console.log("No schema.sql found.");
}