const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

const oldEndpoint = `@app.post("/generate/roadmap-refinement-analysis")
async def generate_roadmap_refinement_analysis(req: RefinementAnalysisRequest):
    try:
        if not mistral_client:
            raise HTTPException(status_code=500, detail="Mistral is not configured")

        system_prompt = """You are an expert career and learning coach.
You are given an adaptive context containing an existing learning roadmap, findings from a recent technical interview, and a job description.
Your task is to analyze this data and return a structured JSON response identifying specific modifications to the roadmap.

You MUST return a JSON object with the following structure:
{
    "confirmed_strengths": ["list of skills candidate proved they know"],
    "actual_interview_weaknesses": ["list of areas candidate struggled with in the interview"],
    "concepts_needing_improvement": ["specific technical concepts to review based on interview"],
    "jd_gaps_confirmed_by_interview": ["requirements from JD that candidate lacks based on interview"],
    "roadmap_topics_to_add": ["new learning topics to insert into roadmap"],
    "roadmap_topics_to_remove_or_reduce": ["topics from existing roadmap to skip or reduce because candidate knows them"],
    "priority_changes": ["topics that should be moved up or down in priority"]
}

Do NOT invent any findings. Base your analysis strictly on the provided context."""

        analysis_prompt = f"Adaptive Context: {json.dumps(req.preparedContext)}"

        resp = mistral_client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": analysis_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        analysis_data = json.loads(resp.choices[0].message.content.strip())
        
        return {
            "success": True,
            "analysis": analysis_data
        }
    except Exception as e:
        print(f"Error in refinement analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))`;

const newEndpoint = `@app.post("/generate/roadmap-refinement")
async def generate_roadmap_refinement(req: RefinementAnalysisRequest):
    try:
        if not mistral_client:
            raise HTTPException(status_code=500, detail="Mistral is not configured")

        # Step 1: Analysis
        system_prompt_analysis = """You are an expert career and learning coach.
You are given an adaptive context containing an existing learning roadmap, findings from a recent technical interview, and a job description.
Your task is to analyze this data and return a structured JSON response identifying specific modifications to the roadmap.

You MUST return a JSON object with the following structure:
{
    "confirmed_strengths": ["list of skills candidate proved they know"],
    "actual_interview_weaknesses": ["list of areas candidate struggled with in the interview"],
    "concepts_needing_improvement": ["specific technical concepts to review based on interview"],
    "jd_gaps_confirmed_by_interview": ["requirements from JD that candidate lacks based on interview"],
    "roadmap_topics_to_add": ["new learning topics to insert into roadmap"],
    "roadmap_topics_to_remove_or_reduce": ["topics from existing roadmap to skip or reduce because candidate knows them"],
    "priority_changes": ["topics that should be moved up or down in priority"]
}

Do NOT invent any findings. Base your analysis strictly on the provided context."""

        analysis_prompt = f"Adaptive Context: {json.dumps(req.preparedContext)}"

        resp_analysis = mistral_client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {"role": "system", "content": system_prompt_analysis},
                {"role": "user", "content": analysis_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        analysis_data = json.loads(resp_analysis.choices[0].message.content.strip())
        
        # Step 2: Generate Refined Roadmap
        system_prompt_generate = """You are an expert career and learning coach.
Based on the prior analysis, generate the final refined learning roadmap.
The candidate just completed an interview. You MUST adjust the roadmap phases based on the new analysis. Preserve useful topics, but add, remove, or reprioritize based on actual interview evidence.
Return a structured JSON object exactly matching this schema:
{
  "readiness_score": <number 0-100 based on interview performance and remaining gaps>,
  "estimated_weeks": <number>,
  "hours_per_week": <number>,
  "summary": "<brief summary of the refined plan>",
  "focus_skills": ["<skill1>", "<skill2>"],
  "phases": [
    {
      "title": "<phase title>",
      "description": "<what they will learn and why, based on the interview>",
      "week_start": <number>,
      "week_end": <number>,
      "priority": "<high|medium|low>",
      "skills": ["<skill1>", "<skill2>"],
      "resources": []
    }
  ]
}
IMPORTANT: The 'resources' array for each phase MUST be empty []."""

        generate_prompt = f"Adaptive Context: {json.dumps(req.preparedContext)}\n\nRefinement Analysis: {json.dumps(analysis_data)}"

        resp_generate = mistral_client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {"role": "system", "content": system_prompt_generate},
                {"role": "user", "content": generate_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        roadmap_data = json.loads(resp_generate.choices[0].message.content.strip())
        
        # Ensure resources is always an array to pass frontend validation
        for phase in roadmap_data.get("phases", []):
            phase["resources"] = []
            
        return {
            "success": True,
            "analysis": analysis_data,
            "refined_roadmap": roadmap_data
        }
    except Exception as e:
        print(f"Error in refinement generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))`;

content = content.replace(oldEndpoint, newEndpoint);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated main.py with 2-stage refinement generation");