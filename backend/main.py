import os
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
