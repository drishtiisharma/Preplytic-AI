require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
    const { data, error } = await supabase.from('interview_questions').select('question_number').limit(1);
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Column exists, data:", data);
    }
}
test();