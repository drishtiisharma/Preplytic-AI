const fs = require('fs');
let path = 'src/app/api/roadmap/generate/route.ts';

let content = fs.readFileSync(path, 'utf8');

// Replace everything below "const preparedContext = {"
const newLogic = `
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
    });

    if (!aiResponse.ok) {
       const err = await aiResponse.text();
       return NextResponse.json({ error: "Backend data preparation failed", details: err }, { status: 502 });
    }

    const aiData = await aiResponse.json();
    const generatedRoadmap = aiData.dummy_roadmap;
    
    // validateRoadmap(generatedRoadmap);

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
`;

const replaceTarget = "const preparedContext = {";
const splitIdx = content.indexOf(replaceTarget);
if (splitIdx !== -1) {
    content = content.substring(0, splitIdx) + newLogic;
    fs.writeFileSync(path, content, 'utf8');
    console.log("Updated route.ts successfully");
} else {
    console.log("Could not find replacement target");
}