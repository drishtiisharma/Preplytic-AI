import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `You are an expert career coach and technical mentor. 
Given a Job Description and a candidate's parsed Resume Data, your task is to generate a personalized learning roadmap.
Output the result ONLY as a valid JSON object matching this schema:
{
  "readiness_score": <number 0-100>,
  "estimated_weeks": <number>,
  "hours_per_week": <number>,
  "summary": "<string, overview of the candidate's gap and roadmap goal>",
  "focus_skills": ["<string>", ...],
  "phases": [
    {
      "title": "<string>",
      "description": "<string>",
      "week_start": <number>,
      "week_end": <number>,
      "priority": "<high|medium|low>",
      "skills": ["<string>", ...],
      "resources": ["<string>", ...]
    }
  ]
}
Do not include markdown blocks or any other text outside the JSON.`;

async function generateAIResponse(jobProfile: any, resumeData: any) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const userPrompt = `Job Profile:
${JSON.stringify(jobProfile, null, 2)}

Parsed Resume Data:
${JSON.stringify(resumeData, null, 2)}

Generate the JSON roadmap.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenAI API Error:", err);
    throw new Error("Failed to generate roadmap from AI service.");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { job_profile_id, resume_record_id } = body;

    if (!job_profile_id || !resume_record_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify Job Profile
    const { data: jobProfile, error: jobError } = await supabase
      .from("job_profiles")
      .select("*")
      .eq("id", job_profile_id)
      .eq("user_id", user.id)
      .single();

    if (jobError || !jobProfile) {
      return NextResponse.json({ error: "Job profile not found or access denied." }, { status: 404 });
    }

    // 2. Verify Resume Record
    const { data: resumeRecord, error: resumeError } = await supabase
      .from("resume_records")
      .select("*")
      .eq("id", resume_record_id)
      .eq("user_id", user.id)
      .single();

    if (resumeError || !resumeRecord) {
      return NextResponse.json({ error: "Resume record not found or access denied." }, { status: 404 });
    }

    // 3. Check for existing roadmap (cache)
    const { data: existingRoadmap } = await supabase
      .from("roadmaps")
      .select("*, roadmap_versions(*, roadmap_items(*))")
      .eq("job_profile_id", job_profile_id)
      .eq("resume_record_id", resume_record_id)
      .eq("user_id", user.id)
      .single();

    if (existingRoadmap) {
      return NextResponse.json({ success: true, data: existingRoadmap, source: "cache" });
    }

    // 4. To get parsed resume data
    const resumeData = {
       fileName: resumeRecord.file_name,
       fileSize: resumeRecord.file_size,
       uploadedAt: resumeRecord.uploaded_at
    };

    // 5. Call AI Service
    let generatedRoadmap;
    try {
      generatedRoadmap = await generateAIResponse(jobProfile, resumeData);
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 500 });
    }

    // 6. Insert into Supabase
    const { data: roadmapInsert, error: roadmapError } = await supabase
      .from("roadmaps")
      .insert({
        user_id: user.id,
        job_profile_id,
        resume_record_id,
        readiness_score: generatedRoadmap.readiness_score,
        estimated_weeks: generatedRoadmap.estimated_weeks,
        hours_per_week: generatedRoadmap.hours_per_week,
        summary: generatedRoadmap.summary,
        focus_skills: generatedRoadmap.focus_skills
      })
      .select()
      .single();

    if (roadmapError) throw roadmapError;

    const { data: versionInsert, error: versionError } = await supabase
      .from("roadmap_versions")
      .insert({
        roadmap_id: roadmapInsert.id,
        version_number: 1,
        source: "initial"
      })
      .select()
      .single();

    if (versionError) throw versionError;

    const itemsToInsert = generatedRoadmap.phases.map((phase: any) => ({
      roadmap_version_id: versionInsert.id,
      title: phase.title,
      description: phase.description,
      week_start: phase.week_start,
      week_end: phase.week_end,
      priority: phase.priority,
      skills: phase.skills,
      resources: phase.resources,
      progress: 0,
      status: "not_started"
    }));

    const { error: itemsError } = await supabase
      .from("roadmap_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // 7. Return the final structured data
    const { data: finalRoadmap } = await supabase
      .from("roadmaps")
      .select("*, roadmap_versions(*, roadmap_items(*))")
      .eq("id", roadmapInsert.id)
      .single();

    return NextResponse.json({ success: true, data: finalRoadmap, source: "generated" });

  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}