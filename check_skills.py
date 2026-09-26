import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
headers = {"apikey": supabase_key, "Authorization": f"Bearer {supabase_key}"}

res = requests.get(f"{supabase_url}/rest/v1/roadmaps?select=focus_skills&limit=1", headers=headers)
if res.status_code == 200:
    data = res.json()
    if len(data) > 0:
        val = data[0]['focus_skills']
        print(f"Value: {val}")
        print(f"Python Type: {type(val).__name__}")
    else:
        print("Table is still empty!")
else:
    print(f"Error: {res.text}")