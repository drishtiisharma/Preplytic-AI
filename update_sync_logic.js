const fs = require('fs');
let path = 'src/app/api/roadmap/[id]/sync-interview/route.ts';
let content = fs.readFileSync(path, 'utf8');

const oldCall = `async function generateAIResponse(preparedContext: any): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("LLM configuration missing. Please set OPENAI_API_KEY.");
  }
  
  // As per instructions: "LLM/API is NOT integrated yet: do not call any AI API. 
  // Keep future AI generation behind the existing service/function boundary."
  throw new Error("AI API integration is not fully configured yet. Please configure the LLM backend.");
}`;

const newCall = `async function generateAIResponse(preparedContext: any): Promise<any> {
  const authHeader = "Bearer dummy";
  const aiResponse = await fetch('http://localhost:8000/generate/roadmap-refinement-analysis', {
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
  return data.analysis;
}`;

content = content.replace(oldCall, newCall);

const oldExecution = `    // 6. Keep future AI generation behind the boundary
    let generatedRoadmap;
    try {
      generatedRoadmap = await generateAIResponse(preparedContext);
      validateRoadmap(generatedRoadmap);
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 501 });
    }

    // 7. Create v2 using the existing versioning workflow
    // The prompt mentions inserting interview_session_id. We'll pass it if the column exists, 
    // otherwise it might throw. Assuming the schema expects it if requested.
    const { data: versionInsert, error: versionInsertError } = await supabase`;

const newExecution = `    // 6. Keep future AI generation behind the boundary
    let generatedAnalysis;
    try {
      generatedAnalysis = await generateAIResponse(preparedContext);
      // STOP execution here for testing the analysis as requested: "Do NOT create the final refined roadmap yet."
      return NextResponse.json({ success: true, analysis: generatedAnalysis });
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 501 });
    }

    /*
    // 7. Create v2 using the existing versioning workflow
    // The prompt mentions inserting interview_session_id. We'll pass it if the column exists, 
    // otherwise it might throw. Assuming the schema expects it if requested.
    const { data: versionInsert, error: versionInsertError } = await supabase`;

content = content.replace(oldExecution, newExecution);

// Comment out the rest of the file
content = content.replace(/    const \{ error: roadmapUpdateError \} = await supabase/g, '    /*const { error: roadmapUpdateError } = await supabase');
content = content.replace(/    return NextResponse\.json\(\{ success: true/g, '    return NextResponse.json({ success: true');
content = content.substring(0, content.lastIndexOf('}')) + '*/\n}'; // This is a bit risky if I cut too much, let's do a simple replace

fs.writeFileSync(path, content, 'utf8');
console.log("Updated sync-interview/route.ts");