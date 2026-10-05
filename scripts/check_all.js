const fs = require('fs');

console.log("=== CHECK 1 & 2: .env ===");
if (fs.existsSync('backend/.env')) {
    const envLines = fs.readFileSync('backend/.env', 'utf8').split('\n');
    const hasKey = envLines.some(l => l.startsWith('OPENROUTER_API_KEY='));
    console.log(`OPENROUTER_API_KEY exists: ${hasKey}`);
    const hasModel = envLines.some(l => l.startsWith('OPENROUTER_TEXT_MODEL='));
    if (hasModel) {
        console.log(`OPENROUTER_TEXT_MODEL is: ${envLines.find(l => l.startsWith('OPENROUTER_TEXT_MODEL=')).split('=')[1]}`);
    } else {
        console.log("OPENROUTER_TEXT_MODEL is missing in .env");
    }
}

console.log("\n=== CHECK 3: config.py ===");
const configCode = fs.readFileSync('backend/ai/config.py', 'utf8');
console.log(`Loads OPENROUTER_API_KEY: ${configCode.includes('OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")')}`);
console.log(`Loads OPENROUTER_TEXT_MODEL: ${configCode.includes('OPENROUTER_TEXT_MODEL = os.getenv("OPENROUTER_TEXT_MODEL", "openrouter/free")')}`);

console.log("\n=== CHECK 4: clients.py ===");
const clientsCode = fs.readFileSync('backend/ai/clients.py', 'utf8');
console.log(`Creates OpenRouter client: ${clientsCode.includes('if AIConfig.OPENROUTER_API_KEY:') && clientsCode.includes('openrouter_client = OpenAI(')}`);

console.log("\n=== CHECK 5: main.py ===");
const mainCode = fs.readFileSync('backend/main.py', 'utf8');
console.log(`Uses openrouter_client: ${mainCode.includes('response = openrouter_client.chat.completions.create(')}`);