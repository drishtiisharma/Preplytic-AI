import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}"
}

# In PostgREST, getting the OpenAPI spec requires the correct path or accept header.
res = requests.get(f"{supabase_url}/rest/v1/", headers=headers)
print(res.text[:1000])