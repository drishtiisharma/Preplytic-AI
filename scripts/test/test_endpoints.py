import sys
import asyncio
sys.path.insert(0, 'backend')
from main import app, GenerateRequest
from fastapi.testclient import TestClient

client = TestClient(app)

payload = {
    "job_profile": {"title": "SE"},
    "resume_data": {"skills": "Python"},
    "candidate_profile": {"name": "Bob"}
}

response = client.post(
    "/generate/cold-email", 
    json=payload,
    headers={"Authorization": "Bearer dummy"}
)
print("Cold Email Status:", response.status_code)
print("Cold Email Response:", response.text)

response_ref = client.post(
    "/generate/referral", 
    json=payload,
    headers={"Authorization": "Bearer dummy"}
)
print("Referral Status:", response_ref.status_code)
print("Referral Response:", response_ref.text)
