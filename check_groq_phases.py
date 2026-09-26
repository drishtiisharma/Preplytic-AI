import sys
import json
sys.path.insert(0, 'backend')
from main import app
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
data = response.json()
roadmap = data.get("roadmap", {})
print("Roadmap keys:", list(roadmap.keys()))
phases = roadmap.get("phases", [])
print("Phases length:", len(phases))
if len(phases) > 0:
    print("First phase keys:", list(phases[0].keys()))