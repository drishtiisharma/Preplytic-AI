const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runTest() {
    try {
        console.log("Creating dummy user & profile for E2E test...");
        // 1. We need a valid roadmap_versions entry, which needs a roadmaps entry
        // To bypass FK constraints, let's just insert directly into roadmaps (if it allows null job/resume), or we mock them.
        // roadmaps might need job_profile_id. Let's try inserting roadmap without them if they are optional, or we just insert them.
        
        const { data: roadmapInsert, error: rErr } = await supabase.from('roadmaps').insert({
            user_id: "00000000-0000-0000-0000-000000000000", // Will likely fail FK if user doesn't exist
            readiness_score: 80,
            estimated_weeks: 4,
            hours_per_week: 10,
            summary: "Test Summary",
            focus_skills: ["Python"],
            current_version: 1
        }).select().single();
        
        if (rErr) {
            console.log("Roadmap Insert Error (Expected if FK fails):", rErr.message);
            return;
        }
    } catch (e) {
        console.error(e);
    }
}
runTest();