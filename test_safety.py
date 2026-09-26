import sys
sys.path.insert(0, 'backend')
from ai.config import AIConfig
import google.genai as genai

gemini_client = genai.Client(api_key=AIConfig.GEMINI_API_KEY)

cold_prompt = """
Write a concise, professional cold email applying for the following job.
Base the email ONLY on the candidate's provided information. Do not invent experience or skills.

Job Profile: {'title': 'Software Engineer'}
Resume/Candidate Info: {'parsed_data': {'name': 'John Doe'}}
Candidate Profile (Additional context): {'skills': ['Python']}
"""

ref_prompt = """
Write a concise, natural, and personalized message asking for a referral for the following job.
It should be suitable for sending on LinkedIn.
Base the message ONLY on the candidate's provided information. Do not invent experience or skills.

Job Profile: {'title': 'Software Engineer'}
Resume/Candidate Info: {'parsed_data': {'name': 'John Doe'}}
Candidate Profile (Additional context): {'skills': ['Python']}
"""

try:
    print("Testing Cold Mail...")
    res1 = gemini_client.models.generate_content(model="gemini-3.8-flash", contents=cold_prompt)
    print("Cold text:", res1.text[:20])
except Exception as e:
    print("Cold Mail Error:", e)

try:
    print("Testing Referral...")
    res2 = gemini_client.models.generate_content(model="gemini-3.8-flash", contents=ref_prompt)
    print("Ref text:", res2.text[:20])
except Exception as e:
    print("Referral Error:", e)
