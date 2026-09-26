const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

const newEndpoint = `
class RefinementAnalysisRequest(BaseModel):
    preparedContext: dict

@app.post("/generate/roadmap-refinement-analysis")
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
        raise HTTPException(status_code=500, detail=str(e))
`;

if (!content.includes("/generate/roadmap-refinement-analysis")) {
    content = content + "\n" + newEndpoint;
    fs.writeFileSync(path, content, 'utf8');
    console.log("Added /generate/roadmap-refinement-analysis endpoint");
} else {
    console.log("Endpoint already exists");
}