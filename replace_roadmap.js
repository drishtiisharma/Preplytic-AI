const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');
let lines = content.split(/\r?\n/);

// Remove lines 495 to 518 (inclusive, 0-indexed)
lines.splice(495, 24);

const newCode = `    try:
        if not mistral_client:
            raise HTTPException(status_code=500, detail="Mistral is not configured")

        system_prompt = """You are an expert career coach and technical mentor. 
Given a Job Description and a candidate's parsed Resume Data, your task is to generate a personalized learning roadmap.
Output the result ONLY as a valid JSON object matching this schema:
{
  "readiness_score": <number 0-100>,
  "estimated_weeks": <number>,
  "hours_per_week": <number>,
  "summary": "<string, overview of the candidate's gap and roadmap goal>",
  "focus_skills": ["<string>", "<string>"],
  "phases": [
    {
      "title": "<string>",
      "description": "<string>",
      "week_start": <number>,
      "week_end": <number>,
      "priority": "<high|medium|low>",
      "skills": ["<string>"],
      "resources": []
    }
  ]
}
IMPORTANT: The 'resources' array for each phase MUST be empty []. Do not include markdown blocks or any other text outside the JSON."""

        prompt = f"Adaptive Context: {json.dumps(clean_roadmap_context)}"
        
        resp_generate = mistral_client.chat.complete(
            model="mistral-small-latest",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        roadmap_data = json.loads(resp_generate.choices[0].message.content.strip())
        
        for phase in roadmap_data.get("phases", []):
            phase["resources"] = []
            
        return {
            "success": True,
            "prepared_context": clean_roadmap_context,
            "dummy_roadmap": roadmap_data
        }
    except Exception as e:
        print(f"Error in roadmap generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))`;

// Insert the new code
lines.splice(495, 0, newCode);

fs.writeFileSync('backend/main.py', lines.join('\n'), 'utf8');
console.log("Replaced roadmap logic.");