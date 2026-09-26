import sys
sys.path.insert(0, 'backend')
from ai.config import AIConfig
import google.genai as genai

gemini_client = genai.Client(api_key=AIConfig.GEMINI_API_KEY)

prompt = """
Write a concise, professional cold email applying for the following job.
Base the email ONLY on the candidate's provided information. Do not invent experience or skills.

Job Profile: {'title': 'Software Engineer'}
Resume/Candidate Info: {'parsed_data': {'name': 'John Doe'}}
Candidate Profile (Additional context): {'skills': ['Python']}
"""

try:
    response = gemini_client.models.generate_content(
        model=AIConfig.GEMINI_TEXT_MODEL,
        contents=prompt,
    )
    print("Cold Mail Generated:")
    print(response.text.strip())
except Exception as e:
    import traceback
    traceback.print_exc()