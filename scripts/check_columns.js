require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'interview_questions' });
    if (error) {
        // RPC might not exist. Fall back to just inserting a fake row to get the error, or query postgrest if there is another way.
        // Wait, we can fetch a single row to see properties, but if it's empty we see nothing.
        // Let's use the REST API via a direct SQL call? Supabase js doesn't support direct sql from anon key.
        // Let's check `database.types.ts` if it exists.
        console.log("RPC Error:", error);
    } else {
        console.log("Columns:", data);
    }
}
test();