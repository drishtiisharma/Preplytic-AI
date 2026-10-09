import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

const regex = /<div className="p-3 border-t border-slate-100 dark:border-border bg-slate-50 dark:bg-slate-900\/50 shrink-0 flex items-center gap-3">[\s\S]*?<div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" \/>[\s\S]*?<p className="text-\[12px\] font-medium text-slate-500">AI is speaking\.\.\.<\/p>[\s\S]*?<\/div>/;

content = content.replace(regex, `{isThinking && (
              <div className="p-3 border-t border-slate-100 dark:border-border bg-slate-50 dark:bg-slate-900/50 shrink-0 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <p className="text-[12px] font-medium text-slate-500 animate-pulse">AI is thinking...</p>
              </div>
            )}`);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');