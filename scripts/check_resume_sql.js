const fs = require('fs');
let content = fs.readFileSync('supabase/migrations/20260920000001_create_resume_records.sql', 'utf8');
console.log(content);