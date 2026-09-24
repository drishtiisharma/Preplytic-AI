require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  const { error } = await supabase
    .from('interview_questions')
    .insert({ 
      session_id: '123e4567-e89b-12d3-a456-426614174000', 
      fake_col: 'test'
    });
  console.log(error);
}
testInsert();