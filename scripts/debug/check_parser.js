const fs = require('fs');
if (fs.existsSync('parser.py')) {
    console.log("parser.py exists in root!");
} else {
    console.log("parser.py does NOT exist in root.");
}