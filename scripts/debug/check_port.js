const { execSync } = require('child_process');
try {
    let output = execSync('netstat -ano | findstr :8000').toString();
    console.log(output);
} catch(e) {
    console.log("No process on port 8000");
}