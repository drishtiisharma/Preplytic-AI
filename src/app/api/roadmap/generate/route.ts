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


function validateRoadmap(roadmap: any) {
  if (typeof roadmap.readiness_score !== 'number' || roadmap.readiness_score < 0 || roadmap.readiness_score > 100) throw new Error("Invalid readiness_score");
  if (typeof roadmap.estimated_weeks !== 'number' || roadmap.estimated_weeks <= 0) throw new Error("Invalid estimated_weeks");
  if (typeof roadmap.hours_per_week !== 'number' || roadmap.hours_per_week <= 0) throw new Error("Invalid hours_per_week");
  if (typeof roadmap.summary !== 'string' || !roadmap.summary.trim()) throw new Error("Invalid summary");
  if (!Array.isArray(roadmap.focus_skills) || roadmap.focus_skills.length === 0) throw new Error("Invalid focus_skills");
  if (!Array.isArray(roadmap.phases) || roadmap.phases.length === 0) throw new Error("Invalid phases");
  
  for (const phase of roadmap.phases) {
    if (typeof phase.title !== 'string') throw new Error("Phase missing title");
    if (typeof phase.description !== 'string') throw new Error("Phase missing description");
    if (typeof phase.week_start !== 'number' || typeof phase.week_end !== 'number') throw new Error("Phase missing weeks");
    if (!['high', 'medium', 'low'].includes(phase.priority)) throw new Error("Invalid phase priority");
    if (!Array.isArray(phase.skills) || !Array.isArray(phase.resources)) throw new Error("Phase missing skills/resources");
  }
}

async function generateAIResponse(jobProfile: any, resumeData: any): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("LLM configuration missing. Please set OPENAI_API_KEY.");
  }
  
  // As per instructions: "LLM/API is NOT integrated yet: do not call any AI API. 
  // Keep generation behind a small service/function boundary; if generation is unavailable, 
  // return a clear configuration error instead of inserting fake data."
  throw new Error("AI API integration is not fully configured yet. Please configure the LLM backend.");
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

    // 4. To get parsed resume data & candidate profile
    const { data: candidateProfile } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("user_id", user.id)
      .eq("resume_record_id", resume_record_id)
      .single();

    const preparedContext = {
       jobDescription: jobProfile.description || jobProfile.title,
       resumeContent: candidateProfile ? candidateProfile.parsed_content : "No parsed content available",
       skills: candidateProfile ? candidateProfile.skills : [],
       existingSkillGaps: [], // To be populated if previous interview gaps exist
    };

    // 5. Call AI Service
    let generatedRoadmap;
    try {
      generatedRoadmap = await generateAIResponse(preparedContext, null);
      validateRoadmap(generatedRoadmap);
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 501 });
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
        focus_skills: generatedRoadmap.focus_skills,
        current_version: 1
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