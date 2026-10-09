import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

// 1. isThinking logic
// We just set isThinking to false in the landing page because the interview hasn't started yet!
content = content.replace(
  '  return (',
  '  const isThinking = false;\n\n  return ('
);

// 2. Decorative circles
content = content.replace(
  /<div className="w-64 h-64 border border-teal-500\/10 rounded-full animate-\[ping_3s_cubic-bezier\(0,0,0\.2,1\)_infinite\]" \/>\s*<div className="absolute w-96 h-96 border border-teal-500\/5 rounded-full animate-\[ping_3s_cubic-bezier\(0,0,0\.2,1\)_infinite\] animation-delay-1000" \/>/g,
  `{isThinking && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="w-64 h-64 border-2 border-dashed border-teal-500/20 rounded-full animate-[spin_8s_linear_infinite] opacity-60" />
                    <div className="absolute w-96 h-96 border-2 border-dashed border-teal-500/10 rounded-full animate-[spin_12s_linear_infinite_reverse] opacity-40" />
                    <div className="absolute w-72 h-72 border border-teal-500/20 rounded-full animate-pulse opacity-50" />
                  </div>
                )}`
);

// 3. AI is speaking...
content = content.replace(
  /<p className="text-\[13px\] font-medium text-slate-500 mt-4">AI is speaking\.\.\.<\/p>/g,
  `{isThinking && <p className="text-[13px] font-medium text-slate-500 mt-4 animate-pulse">AI is thinking...</p>}`
);
content = content.replace(
  /\{false && \(\s*<div className="flex items-center gap-2 mb-3 px-2">[\s\S]*?<p className="text-\[11px\] font-medium text-slate-500">AI is speaking\.\.\.<\/p>[\s\S]*?<\/div>\s*\)\}/g,
  `{isThinking && (
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <p className="text-[11px] font-medium text-slate-500 animate-pulse">AI is thinking...</p>
                </div>
              )}`
);

// 4. Remove Mic & PhoneOff & Volume2 in bottom controls
const btnRegex = /<div className="flex items-center justify-center gap-4">[\s\S]*?(?:\{submitError &&|<Button onClick=\{handleStartInterview\})/;
// wait, the landing page might not have submitError, it might have Start Interview? Let's check what's in the button area.
// Just safely read it first instead of blindly replacing.