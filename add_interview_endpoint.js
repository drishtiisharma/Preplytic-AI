const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');

const newEndpoint = `
class InterviewGenerateRequest(BaseModel):
    job_profile: dict
    resume_data: dict
    selected_jd_topics: list = []
    selected_resume_topics: list = []
    difficulty: str
    number_of_questions: int

@app.post("/generate/interview-questions")
async def generate_interview_questions(req: InterviewGenerateRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        
    if not gemini_client:
        raise HTTPException(status_code=500, detail="Gemini client not configured")
        
    prompt = f"""
    Generate exactly {req.number_of_questions} interview questions for the following candidate applying for this job.
    
    Difficulty: {req.difficulty}
    JD Topics to cover: {', '.join(req.selected_jd_topics) if req.selected_jd_topics else 'None specified'}
    Resume Topics to cover: {', '.join(req.selected_resume_topics) if req.selected_resume_topics else 'None specified'}
    
    Job Profile: {req.job_profile}
    Resume/Candidate Info: {req.resume_data}
    
    Return a clean JSON array of strings containing ONLY the questions. Do NOT return markdown formatting like json blocks.
    """
    
    try:
        response = gemini_client.models.generate_content(
            model=AIConfig.GEMINI_TEXT_MODEL,
            contents=prompt,
        )
        import json
        text = response.text.strip()
        if text.startswith("```"): text = text.split("\n", 1)[-1]
        if text.endswith("```"): text = text.rsplit("\n", 1)[0]
        text = text.strip()
        
        questions = json.loads(text)
        return {"questions": questions}
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate interview questions")
`;

content += newEndpoint;
fs.writeFileSync('backend/main.py', content, 'utf8');
console.log("Added /generate/interview-questions to backend");