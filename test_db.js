require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  const { data: qData, error: qError } = await supabase
    .from('interview_questions')
    .select('*')
    .limit(1);

  if (qError) {
    console.error('Error fetching:', qError);
  } else if (qData && qData.length > 0) {
    console.log('Columns:', Object.keys(qData[0]));
  } else {
    console.log('No data found, cannot introspect columns easily.');
  }
}
testInsert();