import os
import json
from dotenv import load_dotenv
load_dotenv('backend/.env')

from backend.ai.config import AIConfig
from backend.ai.clients import gemini_client

print("API KEY exists:", bool(AIConfig.GEMINI_API_KEY))

req = {
    "number_of_questions": 2,
    "difficulty": "intermediate",
    "selected_jd_topics": [],
    "selected_resume_topics": [],
    "job_profile": {"title": "Software Engineer", "job_description": "We need a python dev."},
    "resume_data": {"skills": ["Python"]}
}

prompt = f"""
Generate exactly {req['number_of_questions']} interview questions for the following candidate applying for this job.

Difficulty: {req['difficulty']}
JD Topics to cover: {', '.join(req['selected_jd_topics']) if req['selected_jd_topics'] else 'None specified'}
Resume Topics to cover: {', '.join(req['selected_resume_topics']) if req['selected_resume_topics'] else 'None specified'}

Job Profile: {req['job_profile']}
Resume/Candidate Info: {req['resume_data']}

Return a clean JSON array of strings containing ONLY the questions. Do NOT return markdown formatting like json blocks.
"""

try:
    print("Calling Gemini...")
    response = gemini_client.models.generate_content(
        model=AIConfig.GEMINI_TEXT_MODEL,
        contents=prompt,
    )
    print("Response text:", response.text)
except Exception as e:
    import traceback
    traceback.print_exc()