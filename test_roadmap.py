import sys
sys.path.insert(0, 'backend')
from main import app, RoadmapRequest
from fastapi.testclient import TestClient

client = TestClient(app)

payload = {
    "job_profile": {"title": "Software Engineer"},
    "resume_record": {"raw_text": "Experienced Python Developer"},
    "candidate_profile": {"skills": ["Python"]}
}

response = client.post(
    "/generate/roadmap", 
    json=payload,
    headers={"Authorization": "Bearer dummy"}
)
print("Status:", response.status_code)
print("Response:", response.text)