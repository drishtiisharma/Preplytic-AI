const fs = require('fs');

let mainContent = fs.readFileSync('backend/main.py', 'utf8');

const newEndpoints = `
from ai.clients import gemini_client
from ai.config import AIConfig
import uuid

class GenerateRequest(BaseModel):
    job_profile: dict
    resume_data: dict
    linkedin_url: str = None

@app.post("/generate/cold-email")
async def generate_cold_email(req: GenerateRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        
    if not gemini_client:
        raise HTTPException(status_code=500, detail="Gemini client not configured")
        
    prompt = f"""
    Write a concise, professional cold email applying for the following job.
    Base the email ONLY on the candidate's provided information. Do not invent experience or skills.
    
    Job Profile: {req.job_profile}
    Resume/Candidate Info: {req.resume_data}
    """
    
    try:
        response = gemini_client.models.generate_content(
            model=AIConfig.GEMINI_TEXT_MODEL,
            contents=prompt,
        )
        return {
            "id": str(uuid.uuid4()),
            "message_type": "cold_mail",
            "content": response.text.strip()
        }
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate cold email")

@app.post("/generate/referral")
async def generate_referral(req: GenerateRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        
    if not gemini_client:
        raise HTTPException(status_code=500, detail="Gemini client not configured")
        
    prompt = f"""
    Write a concise, natural, and personalized message asking for a referral for the following job.
    It should be suitable for sending on LinkedIn.
    Base the message ONLY on the candidate's provided information. Do not invent experience or skills.
    
    Job Profile: {req.job_profile}
    Resume/Candidate Info: {req.resume_data}
    """
    
    if req.linkedin_url:
         prompt += f"\nInclude a reference or link to the candidate's LinkedIn: {req.linkedin_url}"
    
    try:
        response = gemini_client.models.generate_content(
            model=AIConfig.GEMINI_TEXT_MODEL,
            contents=prompt,
        )
        return {
            "id": str(uuid.uuid4()),
            "message_type": "referral_message",
            "content": response.text.strip()
        }
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate referral message")
`

mainContent += newEndpoints;
fs.writeFileSync('backend/main.py', mainContent, 'utf8');
console.log("Added endpoints to backend");