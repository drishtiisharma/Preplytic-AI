import fs from 'fs';
let content = fs.readFileSync('src/components/landing/Hero.tsx', 'utf8');

content = content.replace(
  '<Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-zinc-200 text-teal-600 hover:bg-teal-50 dark:border-zinc-800 dark:text-teal-400 dark:hover:bg-teal-950/50">',
  '<Button size="lg" variant="outline" nativeButton={false} render={<Link href="/#how-it-works" />} className="rounded-full px-8 h-12 text-base border-zinc-200 text-teal-600 hover:bg-teal-50 dark:border-zinc-800 dark:text-teal-400 dark:hover:bg-teal-950/50">'
);

fs.writeFileSync('src/components/landing/Hero.tsx', content, 'utf8');
console.log("Fixed Hero Watch Demo button!");