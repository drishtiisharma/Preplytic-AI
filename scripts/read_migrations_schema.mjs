import fs from 'fs';
console.log(fs.readFileSync('supabase/migrations/20260920000001_create_resume_records.sql', 'utf8'));
console.log('---');
console.log(fs.readFileSync('supabase/migrations/20260921200000_create_job_profiles.sql', 'utf8'));