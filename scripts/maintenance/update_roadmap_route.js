const fs = require('fs');
let path = 'src/app/api/roadmap/generate/route.ts';
let content = fs.readFileSync(path, 'utf8');

const oldLogic = `    // 4. To get parsed resume data & candidate profile
    const { data: candidateProfile } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("user_id", user.id)
      .eq("resume_record_id", resume_record_id)
      .single();

    
    // 5. Call AI Service (Data Preparation Phase)
    const authHeader = request.headers.get('authorization');
    const aiResponse = await fetch('http://localhost:8000/generate/roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || \`Bearer \${process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key"}\`
      },
      body: JSON.stringify({
        job_profile: jobProfile || {},
        candidate_profile: candidateProfile || {},
        resume_record: resumeRecord || {}
      })
    });`;

const newLogic = `    // 4. To get parsed resume data & candidate profile
    const { data: candidateProfile } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("user_id", user.id)
      .eq("resume_record_id", resume_record_id)
      .single();

    // 4.5 Fetch latest completed interview report
    const { data: latestSession } = await supabase
      .from('interview_sessions')
      .select('id')
      .eq('job_profile_id', job_profile_id)
      .eq('resume_id', resume_record_id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let interviewReport = null;
    if (latestSession) {
      const { data: report } = await supabase
        .from('interview_reports')
        .select('*')
        .eq('session_id', latestSession.id)
        .single();
      interviewReport = report;
    }

    // 5. Call AI Service (Data Preparation Phase)
    const authHeader = request.headers.get('authorization');
    const aiResponse = await fetch('http://localhost:8000/generate/roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || \`Bearer \${process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key"}\`
      },
      body: JSON.stringify({
        job_profile: jobProfile || {},
        candidate_profile: candidateProfile || {},
        resume_record: resumeRecord || {},
        interview_report: interviewReport || {}
      })
    });`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated roadmap route with interview report fetch");