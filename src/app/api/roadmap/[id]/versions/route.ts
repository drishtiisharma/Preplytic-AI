import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function generateAIResponse(jobProfile: any, resumeData: any) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("LLM configuration missing. Please set OPENAI_API_KEY.");
  }
  
  // As per instructions: "LLM/API is NOT integrated yet: do not call any AI API. 
  // Keep generation behind a small service/function boundary; if generation is unavailable, 
  // return a clear configuration error instead of inserting fake data."
  throw new Error("AI API integration is not fully configured yet. Please configure the LLM backend.");
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roadmapId = params.id;
    if (!roadmapId) {
      return NextResponse.json({ error: "Missing roadmap ID" }, { status: 400 });
    }

    // 1. Verify Roadmap Ownership and fetch necessary context
    const { data: roadmap, error: roadmapError } = await supabase
      .from("roadmaps")
      .select("*, job_profiles(*), resume_records(*)")
      .eq("id", roadmapId)
      .eq("user_id", user.id)
      .single();

    if (roadmapError || !roadmap) {
      return NextResponse.json({ error: "Roadmap not found or access denied." }, { status: 404 });
    }

    // 2. Fetch current max version number
    const { data: existingVersions, error: versionError } = await supabase
      .from("roadmap_versions")
      .select("version_number")
      .eq("roadmap_id", roadmapId)
      .order("version_number", { ascending: false })
      .limit(1);

    if (versionError) {
      return NextResponse.json({ error: "Failed to fetch version history." }, { status: 500 });
    }

    const currentMaxVersion = existingVersions && existingVersions.length > 0 ? existingVersions[0].version_number : 0;
    const nextVersionNumber = currentMaxVersion + 1;

    // 3. Prepare AI Data
    const resumeData = roadmap.resume_records ? {
       fileName: roadmap.resume_records.file_name,
       fileSize: roadmap.resume_records.file_size,
       uploadedAt: roadmap.resume_records.uploaded_at
    } : null;

    // 4. Call AI Service (stubbed)
    let generatedRoadmap;
    try {
      generatedRoadmap = await generateAIResponse(roadmap.job_profiles, resumeData);
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 501 });
    }

    // 5. Create new version
    const { data: versionInsert, error: versionInsertError } = await supabase
      .from("roadmap_versions")
      .insert({
        roadmap_id: roadmapId,
        version_number: nextVersionNumber,
        source: "update"
      })
      .select()
      .single();

    if (versionInsertError) throw versionInsertError;

    // 6. Create roadmap_items for the new version
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

    // 7. Update roadmaps.current_version
    const { error: roadmapUpdateError } = await supabase
      .from("roadmaps")
      .update({
         current_version: nextVersionNumber,
         readiness_score: generatedRoadmap.readiness_score,
         estimated_weeks: generatedRoadmap.estimated_weeks,
         hours_per_week: generatedRoadmap.hours_per_week,
         summary: generatedRoadmap.summary,
         focus_skills: generatedRoadmap.focus_skills
      })
      .eq("id", roadmapId);

    if (roadmapUpdateError) throw roadmapUpdateError;

    // 8. Return updated roadmap
    const { data: finalRoadmap } = await supabase
      .from("roadmaps")
      .select("*, roadmap_versions(*, roadmap_items(*))")
      .eq("id", roadmapId)
      .eq("roadmap_versions.version_number", nextVersionNumber)
      .single();

    // Attach only the new version just like GET
    if (finalRoadmap) {
       finalRoadmap.roadmap_versions = finalRoadmap.roadmap_versions.filter((v: any) => v.version_number === finalRoadmap.current_version);
    }

    return NextResponse.json({ success: true, data: finalRoadmap, source: "updated" });

  } catch (error: any) {
    console.error("Roadmap version update error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}