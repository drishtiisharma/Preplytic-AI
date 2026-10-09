import fs from 'fs';

let signup = fs.readFileSync('src/app/(auth)/signup/page.tsx', 'utf8');
signup = signup.replace(/next=\/dashboard/g, 'next=/candidate');
fs.writeFileSync('src/app/(auth)/signup/page.tsx', signup, 'utf8');

let login = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');
login = login.replace(/next=\/dashboard/g, 'next=/candidate');
fs.writeFileSync('src/app/(auth)/login/page.tsx', login, 'utf8');

console.log("Updated OAuth redirects!");