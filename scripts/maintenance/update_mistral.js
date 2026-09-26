const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

const oldEndpointStart = `        # Return a dummy roadmap mixed with the analysis so the frontend doesn't crash
        # while satisfying the prompt constraints "Do NOT generate the final roadmap yet."
        return {
            "success": True,
            "prepared_context": clean_roadmap_context,
            "analysis": analysis,
            "dummy_roadmap": {
                "readiness_score": 0,
                "estimated_weeks": 4,
                "hours_per_week": 10,
                "summary": f"Analysis complete. Priority gaps: {', '.join(analysis.get('priority_gaps', []))}",
                "focus_skills": analysis.get("missing_weak_skills", []),
                "phases": [
                    {
                        "title": "Setup",
                        "description": "Waiting for AI integration.",
                        "week_start": 1,
                        "week_end": 1,
                        "priority": "high",
                        "skills": ["None"],
                        "resources": ["None"]
                    }
                ]
            }
        }
    except Exception as e:
        print("Mistral Analysis error:", e)
        raise HTTPException(status_code=500, detail="Failed to run Mistral analysis")`;

const newEndpointStart = `        roadmap_prompt = f"""
        You are an expert career coach and technical mentor. 
        Given the following analysis of a candidate's gaps compared to a target job description, generate a personalized learning roadmap.
        
        Analysis:
        JD Required Skills: {analysis.get('jd_required_skills', [])}
        Candidate Matching Skills: {analysis.get('candidate_matching_skills', [])}
        Missing/Weak Skills: {analysis.get('missing_weak_skills', [])}
        Priority Gaps: {analysis.get('priority_gaps', [])}
        
        Organize it into logical phases based on priority gaps. Each phase should have a clear learning objective.
        Prioritize skills that matter most for the selected JD.
        
        Output the result ONLY as a valid JSON object matching this schema exactly:
        {{
          "readiness_score": <number 0-100>,
          "estimated_weeks": <number>,
          "hours_per_week": <number>,
          "summary": "<string, overview of the candidate's gap and roadmap goal>",
          "focus_skills": ["<string>", ...],
          "phases": [
            {{
              "title": "<string>",
              "description": "<string>",
              "week_start": <number>,
              "week_end": <number>,
              "priority": "<high|medium|low>",
              "skills": ["<string>", ...],
              "resources": []
            }}
          ]
        }}
        
        Note: The resources array MUST be an empty array []. Do NOT invent resources.
        Do not include markdown blocks or any other text outside the JSON.
        """
        
        roadmap_resp = mistral_client.chat.complete(
            model="mistral-small-latest",
            messages=[{"role": "user", "content": roadmap_prompt}],
            response_format={"type": "json_object"}
        )
        
        roadmap_data = json.loads(roadmap_resp.choices[0].message.content.strip())
        
        # Ensure resources is always an array to pass frontend validation
        for phase in roadmap_data.get("phases", []):
            if "resources" not in phase or not isinstance(phase["resources"], list):
                phase["resources"] = []
                
        return {
            "success": True,
            "prepared_context": clean_roadmap_context,
            "analysis": analysis,
            "dummy_roadmap": roadmap_data  # Kept key as dummy_roadmap for frontend compatibility with step 2
        }
    except Exception as e:
        print("Mistral Analysis/Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate roadmap")`;

content = content.replace(oldEndpointStart, newEndpointStart);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated Mistral generation in main.py");