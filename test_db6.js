require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  const { error } = await supabase
    .from('interview_responses')
    .insert({ 
      session_id: '123e4567-e89b-12d3-a456-426614174000', 
      question_id: '123e4567-e89b-12d3-a456-426614174000',
      transcript: 'test',
      score: 8,
      feedback: 'Good',
      strengths: ['Clear'],
      weaknesses: ['Short']
    });
  console.log(error);
}
testInsert();