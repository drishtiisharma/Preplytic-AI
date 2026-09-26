import os
import requests
from pathlib import Path
from dotenv import load_dotenv
import json

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

res = requests.get(f"{supabase_url}/rest/v1/", headers={"apikey": supabase_key})
data = res.json()
print("Top-level keys:", data.keys())
print("components/schemas keys:", data.get("components", {}).get("schemas", {}).keys() if "components" in data else "No components")
if "components" in data:
    schemas = data["components"]["schemas"]
    print("roadmaps:", list(schemas.get("roadmaps", {}).get("properties", {}).keys()))
    print("roadmap_versions:", list(schemas.get("roadmap_versions", {}).get("properties", {}).keys()))