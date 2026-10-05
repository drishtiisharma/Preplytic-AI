const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');

// 1. Update imports
content = content.replace(
    'from ai.clients import gemini_client, groq_client, mistral_client, groq_roadmap_client, tavily_client',
    'from ai.clients import gemini_client, groq_client, mistral_client, groq_roadmap_client, tavily_client, openrouter_client'
);

// 2. Update report endpoint
const oldEndpointStr = `    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq client not configured")`;
const newEndpointStr = `    if not openrouter_client:
        raise HTTPException(status_code=500, detail="OpenRouter client not configured")`;
content = content.replace(oldEndpointStr, newEndpointStr);

const oldCallStr = `    try:
        response = groq_client.chat.completions.create(
            model=AIConfig.GROQ_TEXT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        import json
        text = response.choices[0].message.content.strip()
        report_data = json.loads(text)`;

const newCallStr = `    try:
        response = openrouter_client.chat.completions.create(
            model=AIConfig.OPENROUTER_TEXT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        import json
        text = response.choices[0].message.content.strip()
        if text.startswith("\`"): text = text.split("\\n", 1)[-1]
        if text.endswith("\`"): text = text.rsplit("\\n", 1)[0]
        text = text.strip()
        report_data = json.loads(text)`;

content = content.replace(oldCallStr, newCallStr);

fs.writeFileSync('backend/main.py', content, 'utf8');
console.log("Updated main.py");