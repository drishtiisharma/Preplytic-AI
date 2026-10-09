import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Decorative circles
content = content.replace(
  /<div className="w-64 h-64 border border-teal-500\/10 rounded-full animate-\[ping_3s_cubic-bezier\(0,0,0\.2,1\)_infinite\]" \/>\s*<div className="absolute w-96 h-96 border border-teal-500\/5 rounded-full animate-\[ping_3s_cubic-bezier\(0,0,0\.2,1\)_infinite\] animation-delay-1000" \/>/g,
  `<div className="w-64 h-64 border-2 border-dashed border-teal-500/20 rounded-full animate-[spin_8s_linear_infinite] opacity-60" />\n                  <div className="absolute w-96 h-96 border-2 border-dashed border-teal-500/10 rounded-full animate-[spin_12s_linear_infinite_reverse] opacity-40" />\n                  <div className="absolute w-72 h-72 border border-teal-500/20 rounded-full animate-pulse opacity-50" />`
);

// 2. AI is speaking...
content = content.replace(
  /<p className="text-\[13px\] font-medium text-slate-500 mt-4">AI is speaking\.\.\.<\/p>/g,
  `<p className="text-[13px] font-medium text-slate-500 mt-4 animate-pulse">AI is thinking...</p>`
);
content = content.replace(
  /<p className="text-\[11px\] font-medium text-slate-500">AI is speaking\.\.\.<\/p>/g,
  `<p className="text-[11px] font-medium text-slate-500 animate-pulse">AI is thinking...</p>`
);

// 3. Remove Mic & PhoneOff & Volume2 in bottom controls
const btnRegex = /<div className="flex items-center justify-center gap-4">[\s\S]*?\{submitError &&/g;
content = content.replace(btnRegex, `<div className="flex flex-col items-center justify-center gap-2">\n                  {submitError &&`);

// 4. Remove Download Icon
content = content.replace(
  /<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">\s*<Download className="w-4 h-4" \/>\s*<\/Button>/g,
  ``
);

// 5. Remove Volume2 Icon in Chat Input
content = content.replace(
  /<Button variant="outline" size="icon" className="shrink-0 h-11 w-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">\s*<Volume2 className="w-4 h-4" \/>\s*<\/Button>/g,
  ``
);

// 6. Remove remaining Volume2 inside the central Bot avatar (if any)
content = content.replace(
  /\{false && \(\s*<div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">\s*<Volume2 className="w-3 h-3 text-white" \/>\s*<\/div>\s*\)\}/g,
  ``
);


fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');

const checks = {
  hasMic: content.includes('<Mic '),
  hasMicOff: content.includes('<MicOff '),
  hasPhoneOff: content.includes('<PhoneOff '),
  hasDownload: content.includes('<Download '),
  hasVolume2: content.includes('<Volume2 '),
  isSpeaking: content.includes('AI is speaking...')
};

console.log(JSON.stringify(checks, null, 2));