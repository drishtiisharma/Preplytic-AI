const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data, error } = await supabase.from('roadmap_versions').select('*').limit(1);
  console.log("Roadmap versions columns:", data ? Object.keys(data[0] || {}) : "No data", "Error:", error);
}
checkSchema();