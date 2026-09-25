import os
import asyncio
from fastapi.testclient import TestClient
from dotenv import load_dotenv

load_dotenv("backend/.env")

import sys
sys.path.append("backend")
from main import app

client = TestClient(app)

from supabase import create_client, Client
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Need to login to get a token because RLS doesn't apply to fetching rows in TestClient?
# Actually we can just fetch using the Service Role Key since this is a test script!
load_dotenv(".env.local")
service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not service_key:
    # Just use anon key but we might get 0 rows if RLS blocks read
    supabase = create_client(os.getenv("NEXT_PUBLIC_SUPABASE_URL"), os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
else:
    supabase = create_client(os.getenv("NEXT_PUBLIC_SUPABASE_URL"), service_key)

try:
    print("Fetching test data...")
    res_job = supabase.table("job_profiles").select("*").limit(1).execute()
    job_profile = res_job.data[0] if res_job.data else {}
    
    res_resume = supabase.table("resume_records").select("*").limit(1).execute()
    resume_record = res_resume.data[0] if res_resume.data else {}
    
    res_cand = supabase.table("candidate_profiles").select("*").limit(1).execute()
    candidate_profile = res_cand.data[0] if res_cand.data else {}
    
    print(f"Got Job: {job_profile.get('title')}, Resume: {resume_record.get('id')}")
    
    print("Testing endpoint...")
    response = client.post(
        "/generate/roadmap",
        json={
            "job_profile": job_profile,
            "candidate_profile": candidate_profile,
            "resume_record": resume_record
        },
        headers={"Authorization": "Bearer test"}
    )
    
    print("Status:", response.status_code)
    import json
    if response.status_code == 200:
        data = response.json()
        print("Success! Keys:", data.keys())
        print("Dummy Roadmap:", json.dumps(data.get("dummy_roadmap", {}), indent=2))
    else:
        print("Error response:", response.text)
        
except Exception as e:
    print("Test failed:", repr(e))
