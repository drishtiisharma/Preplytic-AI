const fs = require('fs');
if (fs.existsSync('.env.local')) {
    const content = fs.readFileSync('.env.local', 'utf8');
    if (content.includes('SERVICE_ROLE_KEY')) {
        console.log("Service role key found.");
    } else {
        console.log("No service role key found.");
    }
}