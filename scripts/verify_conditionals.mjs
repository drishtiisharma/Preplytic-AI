import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const regex1 = /\{isThinking && \([\s\S]*?<div className="w-64 h-64 border-2 border-dashed border-teal-500\/20 rounded-full animate-\[spin_8s_linear_infinite\] opacity-60" \/>/;
const regex2 = /\{isThinking && <p className="text-\[13px\] font-medium text-slate-500 mt-4 animate-pulse">AI is thinking\.\.\.<\/p>\}/;

console.log({
  hasCirclesConditional: regex1.test(content),
  hasTextConditional: regex2.test(content),
});