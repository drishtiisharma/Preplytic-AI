import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Get auth token from request to pass to backend
    const authHeader = req.headers.get('authorization');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    // 1. Prevent duplicate report generation
    const { data: existingReport } = await supabase
      .from('interview_reports')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (existingReport) {
      return NextResponse.json({ error: "Report already exists." }, { status: 409 });
    }
    
    // Fetch session to get job/resume IDs
    const { data: session } = await supabase.from('interview_sessions').select('*').eq('id', sessionId).single();
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });

    // 2. Collect all required data
    const [qRes, rRes, jobRes, resumeRes] = await Promise.all([
      supabase.from('interview_questions').select('*').eq('session_id', sessionId).order('created_at', { ascending: true }),
      supabase.from('interview_responses').select('*').eq('session_id', sessionId),
      supabase.from('job_profiles').select('*').eq('id', session.job_profile_id).single(),
      supabase.from('resume_records').select('*').eq('id', session.resume_id).single()
    ]);

    if (qRes.error || rRes.error) {
      return NextResponse.json({ error: "Failed to fetch session data" }, { status: 500 });
    }

    // 3. Generate report via FastAPI backend
    const llmResponse = await fetch('http://localhost:8000/generate/interview-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` // Fallback for backend auth
      },
      body: JSON.stringify({
        job_profile: jobRes.data || {},
        resume_data: resumeRes.data || {},
        questions: qRes.data || [],
        responses: rRes.data || [],
        session_config: session
      })
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text();
      return NextResponse.json({ error: `Backend API Error: ${errText}` }, { status: 502 });
    }

    const generationData = await llmResponse.json();
    const reportPayload = generationData.report;

    // 6. Save to interview_reports
    const { data: savedReport, error: saveError } = await supabase
      .from('interview_reports')
      .insert({
        session_id: sessionId,
        overall_score: reportPayload.overall_score || 0,
        technical_score: reportPayload.technical_score || 0,
        communication_score: reportPayload.communication_score || 0,
        problem_solving_score: 0,
        confidence_score: 0,
        strengths: reportPayload.strengths || [],
        weaknesses: reportPayload.weaknesses || [],
        // Pack all extra fields into topic_analysis JSONB column safely
        topic_analysis: {
           concepts_to_improve: reportPayload.concepts_to_improve || [],
           interview_performance_summary: reportPayload.interview_performance_summary || "",
           job_specific_gaps: reportPayload.job_specific_gaps || [],
           recommended_next_steps: reportPayload.recommended_next_steps || [],
           readiness_summary: reportPayload.readiness_summary || ""
        }
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, report: savedReport });
  } catch (error: any) {
    console.error("Report Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate report" }, { status: 500 });
  }
}
