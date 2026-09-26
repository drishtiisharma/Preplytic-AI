const fs = require('fs');
if (fs.existsSync('src/types')) {
    console.log(fs.readdirSync('src/types'));
} else {
    console.log("No src/types");
}
if (fs.existsSync('types')) {
    console.log(fs.readdirSync('types'));
} else {
    console.log("No types");
}