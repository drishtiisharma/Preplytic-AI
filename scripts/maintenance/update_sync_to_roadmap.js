const fs = require('fs');
let path = 'src/app/api/roadmap/[id]/sync-interview/route.ts';
let content = fs.readFileSync(path, 'utf8');

const oldCall = `const aiResponse = await fetch('http://localhost:8000/generate/roadmap-refinement-analysis', {`;
const newCall = `const aiResponse = await fetch('http://localhost:8000/generate/roadmap-refinement', {`;
content = content.replace(oldCall, newCall);

const oldReturn = `return data.analysis;`;
const newReturn = `return data.refined_roadmap;`;
content = content.replace(oldReturn, newReturn);

const oldExecution = `    // 6. Keep future AI generation behind the boundary
    let generatedAnalysis;
    try {
      generatedAnalysis = await generateAIResponse(preparedContext);
      // STOP execution here for testing the analysis as requested: "Do NOT create the final refined roadmap yet."
      return NextResponse.json({ success: true, analysis: generatedAnalysis });
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 501 });
    }`;

const newExecution = `    // 6. Keep future AI generation behind the boundary
    let generatedRoadmap;
    try {
      generatedRoadmap = await generateAIResponse(preparedContext);
      validateRoadmap(generatedRoadmap);
      return NextResponse.json({ success: true, refined_roadmap: generatedRoadmap });
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 501 });
    }`;
content = content.replace(oldExecution, newExecution);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated sync-interview/route.ts to return refined roadmap");