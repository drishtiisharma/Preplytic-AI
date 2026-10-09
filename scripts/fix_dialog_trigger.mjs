import fs from 'fs';
let content = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');

const oldTrigger = `<DialogTrigger asChild>
                <button type="button" className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
                  Forgot password?
                </button>
              </DialogTrigger>`;

const newTrigger = `<DialogTrigger className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
                Forgot password?
              </DialogTrigger>`;

content = content.replace(oldTrigger, newTrigger);

fs.writeFileSync('src/app/(auth)/login/page.tsx', content, 'utf8');
console.log("Fixed DialogTrigger in login page!");