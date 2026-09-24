import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "LLM configuration missing. Please set OPENAI_API_KEY." }, { status: 501 });
    }

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

    // 2. Collect all questions and responses
    const { data: questions, error: qError } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    const { data: responses, error: rError } = await supabase
      .from('interview_responses')
      .select('*')
      .eq('session_id', sessionId);

    if (qError || rError || !questions || !responses) {
      return NextResponse.json({ error: "Failed to fetch session data" }, { status: 500 });
    }

    // 3. Prepare the Prompt
    const transcriptData = questions.map(q => {
      const resp = responses.find(r => r.question_id === q.id);
      return `Q: ${q.question_text}\nA: ${resp ? resp.transcript : 'No answer provided.'}\nFeedback: ${resp ? resp.feedback : ''}`;
    }).join('\n\n');

    const systemPrompt = `You are an expert technical interviewer. Based on the following interview transcript and question feedback, generate a final comprehensive interview report in JSON format.
Expected JSON structure:
{
  "overall_score": number (0-100),
  "technical_score": number (0-100),
  "communication_score": number (0-100),
  "problem_solving_score": number (0-100),
  "confidence_score": number (0-100),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "topic_analysis": {
    "Topic Name": "Analysis string"
  },
  "actionable_recommendations": ["string"]
}

Transcript:
${transcriptData}`;

    // 4. Generate the report via LLM
    const llmResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: systemPrompt }]
      })
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text();
      return NextResponse.json({ error: `LLM API Error: ${errText}` }, { status: 502 });
    }

    const llmData = await llmResponse.json();
    let reportPayload;
    try {
      reportPayload = JSON.parse(llmData.choices[0].message.content);
    } catch (e) {
      return NextResponse.json({ error: "LLM returned invalid JSON." }, { status: 500 });
    }

    // 5. Validate expected structured response
    const requiredKeys = ['overall_score', 'technical_score', 'communication_score', 'problem_solving_score', 'confidence_score', 'strengths', 'weaknesses', 'topic_analysis', 'actionable_recommendations'];
    for (const key of requiredKeys) {
      if (!(key in reportPayload)) {
         return NextResponse.json({ error: `LLM response missing key: ${key}` }, { status: 500 });
      }
    }

    // 6. Save to interview_reports
    const { data: savedReport, error: saveError } = await supabase
      .from('interview_reports')
      .insert({
        session_id: sessionId,
        overall_score: reportPayload.overall_score,
        technical_score: reportPayload.technical_score,
        communication_score: reportPayload.communication_score,
        problem_solving_score: reportPayload.problem_solving_score,
        confidence_score: reportPayload.confidence_score,
        strengths: reportPayload.strengths,
        weaknesses: reportPayload.weaknesses,
        topic_analysis: reportPayload.topic_analysis,
        actionable_recommendations: reportPayload.actionable_recommendations
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