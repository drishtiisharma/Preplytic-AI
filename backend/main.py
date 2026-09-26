import os
import json
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

from parser import parse_resume

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="Preplytic Parser Service")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # This should be the anon key

class ParseRequest(BaseModel):
    storagePath: str
    userId: str

@app.post("/parse")
async def parse_endpoint(
    req: ParseRequest,
    authorization: str = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    access_token = authorization.split(" ")[1]

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="Supabase configuration missing on server")

    # Initialize Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Set the auth session using the provided token so RLS policies are respected
    try:
        supabase.auth.set_session(access_token, "dummy-refresh-token")
    except Exception as e:
        print("Auth error:", e)
        raise HTTPException(status_code=401, detail="Invalid token")

    # Download the PDF from the 'resumes' bucket
    try:
        response = supabase.storage.from_("resumes").download(req.storagePath)
    except Exception as e:
        print("Download error:", e)
        raise HTTPException(status_code=404, detail="File not found or access denied by RLS")

    if not response:
        raise HTTPException(status_code=404, detail="Empty response from storage")

    # Parse the PDF bytes
    try:
        parsed_data = parse_resume(response)
        return {"success": True, "data": parsed_data}
    except Exception as e:
        print("Parsing error:", e)
        raise HTTPException(status_code=500, detail="Failed to parse resume")

from ai.clients import gemini_client, groq_client, mistral_client, groq_roadmap_client, tavily_client
from ai.config import AIConfig
import uuid

class GenerateRequest(BaseModel):
    job_profile: dict
    resume_data: dict
    candidate_profile: dict = None
    linkedin_url: str = None
async def _generate_with_retry(prompt: str):
    for attempt in range(3):
        try:
            return gemini_client.models.generate_content(
                model=AIConfig.GEMINI_TEXT_MODEL,
                contents=prompt,
            )
        except Exception as e:
            if "503" in str(e) or "UNAVAILABLE" in str(e):
                if attempt < 2:
                    await asyncio.sleep(2)
                    continue
                raise HTTPException(status_code=503, detail="Gemini is temporarily unavailable. Please try again.")
            raise e

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
    Candidate Profile (Additional context): {req.candidate_profile}
    """
    
    try:
        response = await _generate_with_retry(prompt)

        return {
            "id": str(uuid.uuid4()),
            "message_type": "cold_mail",
            "content": response.text.strip()
        }
    except HTTPException:
        raise
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
    Candidate Profile (Additional context): {req.candidate_profile}
    """
    
    if req.linkedin_url:
         prompt += f"\nInclude a reference or link to the candidate's LinkedIn: {req.linkedin_url}"
    
    try:
        response = await _generate_with_retry(prompt)

        return {
            "id": str(uuid.uuid4()),
            "message_type": "referral_message",
            "content": response.text.strip()
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate referral message")

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
        if text.startswith("`"): text = text.split("\n", 1)[-1]
        if text.endswith("`"): text = text.rsplit("\n", 1)[0]
        text = text.strip()
        
        questions = json.loads(text)
        return {"questions": questions}
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate interview questions")
class InterviewEvaluateRequest(BaseModel):
    question: str
    answer: str
    job_profile: dict
    resume_data: dict
    difficulty: str

@app.post("/generate/interview-evaluate")
async def evaluate_interview_answer(req: InterviewEvaluateRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq client not configured")
        
    prompt = f"""
    Evaluate the following candidate answer to an interview question.
    
    Interview Question: {req.question}
    Candidate Answer: {req.answer}
    Difficulty: {req.difficulty}
    
    Context:
    Job Profile: {req.job_profile}
    Resume/Candidate Info: {req.resume_data}
    
    Evaluate the answer based on correctness, relevance, technical quality, and communication quality.
    
    Return a structured JSON object exactly matching this schema:
    {{
      "score": <integer from 0 to 100>,
      "correctness": <integer from 0 to 10>,
      "relevance": <integer from 0 to 10>,
      "technical_quality": <integer from 0 to 10>,
      "communication_quality": <integer from 0 to 10>,
      "strengths": [<list of string strengths>],
      "weaknesses": [<list of string weaknesses>],
      "missing_points": [<list of string missing points>],
      "concise_feedback": "<a concise paragraph of feedback to improve the answer>"
    }}
    
    Output ONLY valid JSON. Do not include markdown formatting or json blocks.
    """
    
    try:
        response = groq_client.chat.completions.create(
            model=AIConfig.GROQ_TEXT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        import json
        text = response.choices[0].message.content.strip()
        
        evaluation = json.loads(text)
        return {"evaluation": evaluation}
    except Exception as e:
        print("Evaluation error:", e)
        raise HTTPException(status_code=500, detail="Failed to evaluate interview answer")

class InterviewFollowupRequest(BaseModel):
    current_question: str
    answer: str
    evaluation: dict
    job_profile: dict
    resume_data: dict
    difficulty: str
    remaining_questions: int

@app.post("/generate/interview-followup")
async def generate_interview_followup(req: InterviewFollowupRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        
    if not gemini_client:
        raise HTTPException(status_code=500, detail="Gemini client not configured")
        
    if req.remaining_questions <= 0:
        return {"should_follow_up": False, "question": None, "reason": "No remaining question budget"}
        
    prompt = f"""
    Based on the candidate's previous answer and evaluation, determine if a follow-up question is necessary to probe deeper into their claims, clarify missing points, or challenge an incomplete response.
    
    Current Question: {req.current_question}
    Candidate's Answer: {req.answer}
    Evaluation from AI: {req.evaluation}
    
    Context:
    Difficulty: {req.difficulty}
    Job Profile: {req.job_profile}
    Resume/Candidate Info: {req.resume_data}
    
    If the answer is sufficient and no meaningful follow-up is needed, return should_follow_up=false.
    If a follow-up is needed, provide the question and a brief reason.
    
    Return a structured JSON object exactly matching this schema:
    {{
      "should_follow_up": <boolean>,
      "question": "<string containing the follow-up question, or null if false>",
      "reason": "<string containing the reason for the follow-up, or null>"
    }}
    
    Output ONLY valid JSON. Do not include markdown formatting or json blocks.
    """
    
    try:
        response = gemini_client.models.generate_content(
            model=AIConfig.GEMINI_TEXT_MODEL,
            contents=prompt,
        )
        import json
        text = response.text.strip()
        if text.startswith("`"): text = text.split("\n", 1)[-1]
        if text.endswith("`"): text = text.rsplit("\n", 1)[0]
        text = text.strip()
        
        result = json.loads(text)
        return {"followup": result}
    except Exception as e:
        print("Followup Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate follow-up question")

from fastapi.responses import Response
import struct
import base64

class TTSRequest(BaseModel):
    text: str

def create_wav_header(pcm_data, num_channels=1, sample_rate=24000, bits_per_sample=16):
    byte_rate = sample_rate * num_channels * (bits_per_sample // 8)
    block_align = num_channels * (bits_per_sample // 8)
    data_size = len(pcm_data)
    
    header = struct.pack('<4sI4s4sIHHIIHH4sI',
        b'RIFF',
        36 + data_size,
        b'WAVE',
        b'fmt ',
        16, 
        1,  
        num_channels,
        sample_rate,
        byte_rate,
        block_align,
        bits_per_sample,
        b'data',
        data_size
    )
    return header + pcm_data

@app.post("/generate/tts")
async def generate_tts(req: TTSRequest):
    if not gemini_client:
        raise HTTPException(status_code=500, detail="Gemini client not configured")
        
    try:
        import google.genai as genai
        # We instruct the model explicitly to return audio and use the AUDIO modality
        prompt = f"Generate audio for this text: {req.text}"
        
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=prompt,
            config=genai.types.GenerateContentConfig(response_modalities=["AUDIO"])
        )
        
        pcm_data = None
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                pcm_data = part.inline_data.data
                break
                
        if not pcm_data:
             raise Exception("No audio data returned by model")
             
        wav_data = create_wav_header(pcm_data)
        
        return Response(content=wav_data, media_type="audio/wav")
    except Exception as e:
        print("TTS Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate TTS audio")

class InterviewReportRequest(BaseModel):
    job_profile: dict
    resume_data: dict
    questions: list
    responses: list
    session_config: dict

@app.post("/generate/interview-report")
async def generate_interview_report(req: InterviewReportRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq client not configured")
        
    transcript = ""
    for q in req.questions:
        resp = next((r for r in req.responses if r.get('question_id') == q.get('id')), None)
        transcript += f"Q: {q.get('question_text')}\n"
        if resp:
            transcript += f"A: {resp.get('response_text', 'No answer')}\n"
            eval_data = resp.get('evaluation', {})
            transcript += f"Evaluation: {eval_data}\n\n"
        else:
            transcript += "A: No answer\n\n"
            
    prompt = f"""
    You are an expert technical interviewer evaluating a candidate's final interview performance.
    
    Context:
    Job Profile: {req.job_profile}
    Resume/Candidate Info: {req.resume_data}
    Session Config: {req.session_config}
    
    Interview Transcript & Evaluations:
    {transcript}
    
    Based ONLY on the dynamically collected interview data above, generate a final comprehensive interview report.
    Do not invent skills, experience, questions, or evaluation results.
    
    Return a structured JSON object exactly matching this schema:
    {{
      "overall_score": <integer 0-100>,
      "technical_score": <integer 0-100>,
      "communication_score": <integer 0-100>,
      "strengths": [<list of strings>],
      "weaknesses": [<list of strings>],
      "concepts_to_improve": [<list of strings>],
      "interview_performance_summary": "<string paragraph>",
      "job_specific_gaps": [<list of strings>],
      "recommended_next_steps": [<list of strings>],
      "readiness_summary": "<string paragraph>"
    }}
    
    Output ONLY valid JSON. Do not include markdown formatting or json blocks.
    """
    
    try:
        response = groq_client.chat.completions.create(
            model=AIConfig.GROQ_TEXT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        import json
        text = response.choices[0].message.content.strip()
        report_data = json.loads(text)
        return {"report": report_data}
    except Exception as e:
        print("Report Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate report")
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
    
    try:
        if not groq_roadmap_client:
            raise HTTPException(status_code=500, detail="Groq Roadmap client is not configured")

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
IMPORTANT: You MUST generate at least 3-4 phases. The 'resources' array inside each phase MUST be empty []. Do not include markdown blocks or any other text outside the JSON."""

        prompt = f"Adaptive Context: {json.dumps(clean_roadmap_context)}"
        
        resp_generate = groq_roadmap_client.chat.completions.create(
            model=AIConfig.GROQ_ROADMAP_MODEL,
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
            "roadmap": roadmap_data
        }
    except Exception as e:
        print(f"Error in roadmap generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))
class RefinementAnalysisRequest(BaseModel):
    preparedContext: dict

@app.post("/generate/roadmap-refinement")
async def generate_roadmap_refinement(req: RefinementAnalysisRequest):
    try:
        if not groq_roadmap_client:
            raise HTTPException(status_code=500, detail="Groq Roadmap client is not configured")

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

        resp_analysis = groq_roadmap_client.chat.completions.create(
            model=AIConfig.GROQ_ROADMAP_MODEL,
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
IMPORTANT: You MUST generate at least 3-4 phases. The 'resources' array inside each phase MUST be empty []."""

        generate_prompt = f"Adaptive Context: {json.dumps(req.preparedContext)}\n\nRefinement Analysis: {json.dumps(analysis_data)}"

        resp_generate = groq_roadmap_client.chat.completions.create(
            model=AIConfig.GROQ_ROADMAP_MODEL,
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
        raise HTTPException(status_code=500, detail=str(e))
