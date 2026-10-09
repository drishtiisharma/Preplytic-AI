import fs from 'fs';
console.log("Does page exist?", fs.existsSync('src/app/(app)/interview/page.tsx'));
if (fs.existsSync('src/app/(app)/interview/page.tsx')) {
  console.log("File content length:", fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8').length);
}