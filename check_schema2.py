import os
import requests
from pathlib import Path
from dotenv import load_dotenv
import json

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

res = requests.get(f"{supabase_url}/rest/v1/?apikey={supabase_key}")
data = res.json()
print("Roadmaps properties:")
print(list(data["definitions"]["roadmaps"]["properties"].keys()))
print("\nRoadmap Versions properties:")
print(list(data["definitions"]["roadmap_versions"]["properties"].keys()))