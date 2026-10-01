import os
import json
from dotenv import load_dotenv
load_dotenv('backend/.env')
import google.genai as genai
from pydantic import BaseModel

key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=key)

prompt = """
Generate exactly 2 interview questions for the following candidate applying for this job.

Difficulty: intermediate
JD Topics to cover: None specified
Resume Topics to cover: None specified

Job Profile: {'title': 'Software Engineer', 'job_description': 'We need a python dev.'}
Resume/Candidate Info: {'skills': ['Python']}

Return a clean JSON array of strings containing ONLY the questions. Do NOT return markdown formatting like json blocks.
"""

try:
    print("Calling Gemini...")
    response = client.models.generate_content(
        model='gemini-2.5-pro',
        contents=prompt,
    )
    text = response.text.strip()
    if text.startswith("`"): text = text.split("\n", 1)[-1]
    if text.endswith("`"): text = text.rsplit("\n", 1)[0]
    text = text.strip()
    questions = json.loads(text)
    print("Success:", questions)
except Exception as e:
    import traceback
    traceback.print_exc()