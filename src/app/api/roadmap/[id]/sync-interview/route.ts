import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// We define validation logic for the updated roadmap
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

async function generateAIResponse(preparedContext: any): Promise<any> {
  const authHeader = "Bearer dummy";
  const aiResponse = await fetch('http://localhost:8000/generate/roadmap-refinement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({
      preparedContext: preparedContext
    })
  });
  
  const data = await aiResponse.json();
  if (!aiResponse.ok) throw new Error(data.detail || "Analysis failed");
  return data.refined_roadmap;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roadmapId } = await params;
    if (!roadmapId) {
      return NextResponse.json({ error: "Missing roadmap ID" }, { status: 400 });
    }

    const body = await request.json();
    const { interview_session_id } = body;

    if (!interview_session_id) {
      return NextResponse.json({ error: "Missing interview_session_id" }, { status: 400 });
    }

    // 1. Fetch existing Roadmap v1 (current version)
    const { data: roadmap, error: roadmapError } = await supabase
      .from("roadmaps")
      .select("*, roadmap_versions(*, roadmap_items(*)), job_profiles(*), resume_records(*)")
      .eq("id", roadmapId)
      .eq("user_id", user.id)
      .single();

    if (roadmapError || !roadmap) {
      return NextResponse.json({ error: "Roadmap not found or access denied." }, { status: 404 });
    }

    const currentVersion = roadmap.roadmap_versions.find((v: any) => v.version_number === roadmap.current_version);
    if (!currentVersion) {
      return NextResponse.json({ error: "Current roadmap version data is corrupted." }, { status: 500 });
    }

    // 2. Fetch the completed Interview Report for interview_session_id
    const { data: interviewReport, error: reportError } = await supabase
      .from("interview_reports")
      .select("*")
      .eq("session_id", interview_session_id)
      .single();

    if (reportError || !interviewReport) {
      return NextResponse.json({ error: "Interview report not found." }, { status: 404 });
    }

    // 3. Extract interview weaknesses, gaps, and topic-level findings
    const demonstratedSkills = interviewReport.strengths || [];
    const missingSkills = interviewReport.weaknesses || [];
    
    // 4. Compare them with existing v1 roadmap items to establish baseline progress
    const existingItems = currentVersion.roadmap_items || [];
    const completedItems = existingItems.filter((i: any) => i.status === "completed" || i.progress === 100);
    const incompleteItems = existingItems.filter((i: any) => i.status !== "completed" && i.progress < 100);

    const overallProgress = existingItems.length > 0 
      ? existingItems.reduce((acc: number, item: any) => acc + (item.progress || 0), 0) / existingItems.length / 100 
      : 0;

    // Recalculate available estimated_weeks and hours_per_week deterministically
    const originalWeeks = roadmap.estimated_weeks || 4;
    const recalculatedWeeks = Math.max(1, Math.ceil(originalWeeks * (1 - overallProgress)));
    
    // 5. Prepare deterministic priority data for roadmap generation
    const preparedContext = {
      adaptiveInstructions: {
        newlyMissingSkills: missingSkills,
        alreadyDemonstratedSkills: demonstratedSkills,
        recalculatedEstimatedWeeks: recalculatedWeeks,
        hoursPerWeekTarget: roadmap.hours_per_week || 10,
        completedTopics: completedItems.map((i: any) => i.title),
        carryOverTopics: incompleteItems.map((i: any) => i.title)
      },
      existingRoadmapSummary: roadmap.summary,
      interviewFindings: {
        overallScore: interviewReport.overall_score,
        topicAnalysis: interviewReport.topic_analysis,
        actionableRecommendations: interviewReport.actionable_recommendations
      },
      jobDescription: roadmap.job_profiles?.description || roadmap.job_profiles?.title
    };

    // Determine max version number
    const maxVersion = Math.max(...roadmap.roadmap_versions.map((v: any) => v.version_number));
    const nextVersionNumber = maxVersion + 1;

    // 6. Keep future AI generation behind the boundary
    let generatedRoadmap;
    try {
      generatedRoadmap = await generateAIResponse(preparedContext);
      validateRoadmap(generatedRoadmap);
      return NextResponse.json({ success: true, refined_roadmap: generatedRoadmap });
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 501 });
    }
// 
//     /*
//     // 7. Create v2 using the existing versioning workflow
//     // The prompt mentions inserting interview_session_id. We'll pass it if the column exists, 
//     // otherwise it might throw. Assuming the schema expects it if requested.
//     const { data: versionInsert, error: versionInsertError } = await supabase
//       .from("roadmap_versions")
//       .insert({
//         roadmap_id: roadmapId,
//         version_number: nextVersionNumber,
//         source: "interview",
//         interview_session_id: interview_session_id
//       })
//       .select()
//       .single();
// 
//     if (versionInsertError) throw versionInsertError;
// 
//     // 8. Create v2 items only from real available data
//     const itemsToInsert = generatedRoadmap.phases.map((phase: any) => ({
//       roadmap_version_id: versionInsert.id,
//       title: phase.title,
//       description: phase.description,
//       week_start: phase.week_start,
//       week_end: phase.week_end,
//       priority: phase.priority,
//       skills: phase.skills,
//       resources: phase.resources,
//       progress: 0,
//       status: "not_started"
//     }));
// 
//     const { error: itemsError } = await supabase
//       .from("roadmap_items")
//       .insert(itemsToInsert);
// 
//     if (itemsError) throw itemsError;
// 
//     // 9. Update roadmaps.current_version to v2
//     /*const { error: roadmapUpdateError } = await supabase
//       .from("roadmaps")
//       .update({
//          current_version: nextVersionNumber,
//          readiness_score: generatedRoadmap.readiness_score,
//          estimated_weeks: generatedRoadmap.estimated_weeks,
//          hours_per_week: generatedRoadmap.hours_per_week,
//          summary: generatedRoadmap.summary,
//          focus_skills: generatedRoadmap.focus_skills
//       })
//       .eq("id", roadmapId);
// 
//     if (roadmapUpdateError) throw roadmapUpdateError;
// 
//     // Return the updated roadmap
//     const { data: finalRoadmap } = await supabase
//       .from("roadmaps")
//       .select("*, roadmap_versions(*, roadmap_items(*))")
//       .eq("id", roadmapId)
//       .eq("roadmap_versions.version_number", nextVersionNumber)
//       .single();
// 
//     if (finalRoadmap) {
//        finalRoadmap.roadmap_versions = finalRoadmap.roadmap_versions.filter((v: any) => v.version_number === finalRoadmap.current_version);
//     }
// 
//     return NextResponse.json({ success: true, data: finalRoadmap, source: "interview_sync" });
// 
  } catch (error: any) {
    console.error("Roadmap interview sync error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
// */
}