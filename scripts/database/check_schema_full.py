import os
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/.env')
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or supabase_key
headers = {"apikey": service_key, "Authorization": f"Bearer {service_key}"}

# We can query the OpenAPI spec for required fields and defaults
res = requests.get(f"{supabase_url}/rest/v1/", headers=headers)
data = res.json()
if "definitions" in data:
    schema = data["definitions"].get("roadmap_items", {})
    print("Schema properties:", list(schema.get("properties", {}).keys()))
    print("Required fields:", schema.get("required", []))
else:
    # PostgREST v10+ doesn't have definitions, it has components/schemas
    schemas = data.get("components", {}).get("schemas", {})
    schema = schemas.get("roadmap_items", {})
    print("Schema properties:", list(schema.get("properties", {}).keys()))
    print("Required fields:", schema.get("required", []))
    
    # Let's also do a quick select limit 1 to see the raw types via postgrest headers
    res2 = requests.get(f"{supabase_url}/rest/v1/roadmap_items?limit=1", headers=headers)
    print("Rows:", res2.json())