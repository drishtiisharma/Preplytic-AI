const { execSync } = require('child_process');
try {
    let output = execSync('netstat -ano | findstr LISTEN').toString();
    console.log(output);
} catch(e) {}