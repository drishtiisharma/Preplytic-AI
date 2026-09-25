import os
with open('backend/main.py', 'a') as f:
    f.write('''

class RoadmapRequest(BaseModel):
    job_profile: dict
    candidate_profile: dict
    resume_record: dict

@app.post("/generate/roadmap")
async def generate_roadmap(req: RoadmapRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    job_title = req.job_profile.get("title", "Unknown Job")
    job_description = req.job_profile.get("description", "No job description provided")
    
    # Handle missing or empty profiles cleanly
    candidate_skills = req.candidate_profile.get("skills", []) if req.candidate_profile else []
    candidate_experience = req.candidate_profile.get("parsed_content", "") if req.candidate_profile else ""
    
    raw_resume_text = req.resume_record.get("raw_text", "") if req.resume_record else ""
    
    if not candidate_experience and raw_resume_text:
        candidate_experience = raw_resume_text
        
    if not candidate_experience:
        candidate_experience = "No candidate experience provided."

    # Create one clean internal input object for future Mistral roadmap generation
    clean_roadmap_context = {
        "target_role": job_title,
        "job_requirements": job_description,
        "candidate_skills": candidate_skills,
        "candidate_experience": candidate_experience,
        "additional_context": "Initial roadmap generation without prior interview gaps."
    }
    
    # DO NOT call Mistral yet.
    # Return a dummy payload matching the frontend schema so the app doesn't break.
    return {
        "success": True,
        "prepared_context": clean_roadmap_context,
        "dummy_roadmap": {
            "readiness_score": 0,
            "estimated_weeks": 4,
            "hours_per_week": 10,
            "summary": "AI generation is disabled. Prepared context successfully.",
            "focus_skills": ["Pending AI Generation"],
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
''')
print("Added roadmap preparation endpoint to backend/main.py")
