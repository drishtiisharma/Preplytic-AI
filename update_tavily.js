const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    'from ai.clients import gemini_client, groq_client, mistral_client', 
    'from ai.clients import gemini_client, groq_client, mistral_client, tavily_client'
);

const oldLogic = `        # Ensure resources is always an array to pass frontend validation
        for phase in roadmap_data.get("phases", []):
            if "resources" not in phase or not isinstance(phase["resources"], list):
                phase["resources"] = []`;

const newLogic = `        # Ensure resources is always an array to pass frontend validation
        for phase in roadmap_data.get("phases", []):
            phase["resources"] = []
            
            # Use Tavily to fetch learning resources based on the generated topic/skills
            if tavily_client and phase.get("skills"):
                # Use up to 3 skills for the query context
                query_skills = " ".join(phase["skills"][:3])
                query = f"Best learning resources tutorials for {phase.get('title')} {query_skills} {clean_roadmap_context['target_role']}"
                try:
                    tavily_resp = tavily_client.search(query=query, max_results=2)
                    for res in tavily_resp.get("results", []):
                        title = res.get('title', 'Resource')
                        url = res.get('url', '')
                        desc = res.get('content', '')[:100] + "..."
                        # Format as a single string since UI expects string[]
                        phase["resources"].append(f"{title} - {url} ({desc})")
                except Exception as e:
                    print(f"Tavily search failed for phase {phase.get('title')}: {e}")
            elif not tavily_client:
                phase["resources"] = ["Tavily client not configured"]`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated Tavily logic");