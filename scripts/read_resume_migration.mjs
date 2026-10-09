import fs from 'fs';
console.log(fs.readFileSync('supabase/migrations/20260920000001_create_resume_records.sql', 'utf8').substring(0, 1000));