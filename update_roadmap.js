const fs = require('fs');
const path = 'src/app/api/roadmap/generate/route.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Stub out generateAIResponse to not call API
const oldGenerateAI = `async function generateAIResponse(jobProfile: any, resumeData: any) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const userPrompt = \`Job Profile:
\${JSON.stringify(jobProfile, null, 2)}

Parsed Resume Data:
\${JSON.stringify(resumeData, null, 2)}

Generate the JSON roadmap.\`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${apiKey}\`
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
}`;

const newGenerateAI = `async function generateAIResponse(jobProfile: any, resumeData: any) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("LLM configuration missing. Please set OPENAI_API_KEY.");
  }
  
  // As per instructions: "LLM/API is NOT integrated yet: do not call any AI API. 
  // Keep generation behind a small service/function boundary; if generation is unavailable, 
  // return a clear configuration error instead of inserting fake data."
  throw new Error("AI API integration is not fully configured yet. Please configure the LLM backend.");
}`;

content = content.replace(oldGenerateAI, newGenerateAI);
if (!content.includes('LLM configuration missing')) {
    content = content.replace(oldGenerateAI.replace(/\n/g, "\r\n"), newGenerateAI.replace(/\n/g, "\r\n"));
}

// 2. Change 500 to 501 for the AI generation failure
content = content.replace(
  `return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 500 });`,
  `return NextResponse.json({ error: error.message || "AI generation failed" }, { status: 501 });`
);

// 3. Add current_version: 1 to roadmap insert
const oldRoadmapInsert = `      .insert({
        user_id: user.id,
        job_profile_id,
        resume_record_id,
        readiness_score: generatedRoadmap.readiness_score,
        estimated_weeks: generatedRoadmap.estimated_weeks,
        hours_per_week: generatedRoadmap.hours_per_week,
        summary: generatedRoadmap.summary,
        focus_skills: generatedRoadmap.focus_skills
      })`;

const newRoadmapInsert = `      .insert({
        user_id: user.id,
        job_profile_id,
        resume_record_id,
        readiness_score: generatedRoadmap.readiness_score,
        estimated_weeks: generatedRoadmap.estimated_weeks,
        hours_per_week: generatedRoadmap.hours_per_week,
        summary: generatedRoadmap.summary,
        focus_skills: generatedRoadmap.focus_skills,
        current_version: 1
      })`;

content = content.replace(oldRoadmapInsert, newRoadmapInsert);
if (!content.includes('current_version: 1')) {
    content = content.replace(oldRoadmapInsert.replace(/\n/g, "\r\n"), newRoadmapInsert.replace(/\n/g, "\r\n"));
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated roadmap generate route");