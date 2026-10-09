import fs from 'fs';
let content = fs.readFileSync('src/app/(auth)/reset-password/page.tsx', 'utf8');

const oldErrorLogic = `    if (error) {
      setErrors({ submit: error.message });
    } else {`;

const newErrorLogic = `    if (error) {
      let msg = error.message;
      if (msg.toLowerCase().includes("different from the old password") || msg.toLowerCase().includes("same") || msg.toLowerCase().includes("should be different")) {
        msg = "Please choose a different password from your current one.";
      }
      setErrors({ submit: msg });
    } else {`;

content = content.replace(oldErrorLogic, newErrorLogic);

fs.writeFileSync('src/app/(auth)/reset-password/page.tsx', content, 'utf8');
console.log("Updated error logic in reset-password!");