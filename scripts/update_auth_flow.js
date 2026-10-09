const fs = require('fs');

let forgotContent = fs.readFileSync('src/app/(auth)/forgot-password/page.tsx', 'utf8');
forgotContent = forgotContent.replace(
  "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.",
  "Check your email for the password reset link."
);
fs.writeFileSync('src/app/(auth)/forgot-password/page.tsx', forgotContent, 'utf8');

let resetContent = fs.readFileSync('src/app/(auth)/reset-password/page.tsx', 'utf8');
resetContent = resetContent.replace('router.push("/dashboard");', 'router.push("/login");');
fs.writeFileSync('src/app/(auth)/reset-password/page.tsx', resetContent, 'utf8');

console.log("Updated auth flows!");