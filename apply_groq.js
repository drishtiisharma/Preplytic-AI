const fs = require('fs');

// 1. backend/ai/config.py
let configContent = fs.readFileSync('backend/ai/config.py', 'utf8');
configContent = configContent.replace(
    /GROQ_STT_MODEL = os\.getenv\("GROQ_STT_MODEL", "whisper-large-v3-turbo"\)/,
    'GROQ_STT_MODEL = os.getenv("GROQ_STT_MODEL", "whisper-large-v3-turbo")\n    GROQ_ROADMAP_API_KEY = os.getenv("GROQ_ROADMAP_API_KEY")\n    GROQ_ROADMAP_MODEL = os.getenv("GROQ_ROADMAP_MODEL", "llama-3.1-8b-instant")'
);
fs.writeFileSync('backend/ai/config.py', configContent, 'utf8');

// 2. backend/ai/clients.py
let clientsContent = fs.readFileSync('backend/ai/clients.py', 'utf8');
clientsContent = clientsContent.replace(
    /groq_client = None\n/,
    'groq_client = None\n\nif AIConfig.GROQ_ROADMAP_API_KEY:\n    groq_roadmap_client = Groq(api_key=AIConfig.GROQ_ROADMAP_API_KEY)\nelse:\n    groq_roadmap_client = None\n'
);
fs.writeFileSync('backend/ai/clients.py', clientsContent, 'utf8');

// 3. backend/main.py
let mainContent = fs.readFileSync('backend/main.py', 'utf8');
mainContent = mainContent.replace(
    'from ai.clients import gemini_client, groq_client, mistral_client, tavily_client',
    'from ai.clients import gemini_client, groq_client, mistral_client, groq_roadmap_client, tavily_client'
);

let mainLines = mainContent.split(/\r?\n/);
let inRoadmap = false;
for (let i = 0; i < mainLines.length; i++) {
    if (mainLines[i].includes('@app.post("/generate/roadmap")')) inRoadmap = true;
    if (inRoadmap && mainLines[i].includes('if not mistral_client:')) {
        mainLines[i] = mainLines[i].replace('mistral_client', 'groq_roadmap_client');
        mainLines[i+1] = mainLines[i+1].replace('Mistral is not configured', 'Groq Roadmap client is not configured');
    }
    if (inRoadmap && mainLines[i].includes('mistral_client.chat.complete(')) {
        mainLines[i] = mainLines[i].replace('mistral_client.chat.complete', 'groq_roadmap_client.chat.completions.create');
    }
    if (inRoadmap && mainLines[i].includes('model="mistral-small-latest"')) {
        mainLines[i] = mainLines[i].replace('"mistral-small-latest"', 'AIConfig.GROQ_ROADMAP_MODEL');
    }
}
fs.writeFileSync('backend/main.py', mainLines.join('\n'), 'utf8');

// 4. backend/.env
let envContent = fs.readFileSync('backend/.env', 'utf8');
if (!envContent.includes('GROQ_ROADMAP_API_KEY')) {
    // try to get existing groq key to reuse for convenience
    let groqKeyMatch = envContent.match(/GROQ_API_KEY=(.*)/);
    let defaultKey = groqKeyMatch ? groqKeyMatch[1] : 'your_groq_key_here';
    envContent += `\nGROQ_ROADMAP_API_KEY=${defaultKey}\nGROQ_ROADMAP_MODEL=llama-3.1-8b-instant\n`;
    fs.writeFileSync('backend/.env', envContent, 'utf8');
}

console.log("All modifications applied successfully.");