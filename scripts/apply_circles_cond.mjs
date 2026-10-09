import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const regex = /<div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">[\s\S]*?<div className="w-64 h-64 border-2 border-dashed border-teal-500\/20 rounded-full animate-\[spin_8s_linear_infinite\] opacity-60" \/>[\s\S]*?<div className="absolute w-96 h-96 border-2 border-dashed border-teal-500\/10 rounded-full animate-\[spin_12s_linear_infinite_reverse\] opacity-40" \/>[\s\S]*?<div className="absolute w-72 h-72 border border-teal-500\/20 rounded-full animate-pulse opacity-50" \/>[\s\S]*?<\/div>/;

const newCircles = `{isThinking && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="w-64 h-64 border-2 border-dashed border-teal-500/20 rounded-full animate-[spin_8s_linear_infinite] opacity-60" />
                    <div className="absolute w-96 h-96 border-2 border-dashed border-teal-500/10 rounded-full animate-[spin_12s_linear_infinite_reverse] opacity-40" />
                    <div className="absolute w-72 h-72 border border-teal-500/20 rounded-full animate-pulse opacity-50" />
                  </div>
                )}`;

content = content.replace(regex, newCircles);

// Ensure footer text is conditionally wrapped
const footerRegex = /\{false && \([\s\S]*?<p className="text-\[11px\] font-medium text-slate-500 animate-pulse">AI is thinking\.\.\.<\/p>[\s\S]*?<\/div>\s*\)\}/;
content = content.replace(footerRegex, `{isThinking && (
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <p className="text-[11px] font-medium text-slate-500 animate-pulse">AI is thinking...</p>
                </div>
              )}`);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Wrapped circles in isThinking condition!");