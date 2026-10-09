import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Inject isThinking
content = content.replace(
  '  return (',
  '  const isThinking = isSubmitting || questionsLoading || isProcessingVoice || !currentQ;\n\n  return ('
);

// 2. Decorative background circles conditional rendering + new dashed styles
const oldCirclesRegex = /\{\/\* Decorative background circles \*\/\}[\s\S]*?<div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">[\s\S]*?<div className="w-64 h-64 border border-teal-500\/10 rounded-full animate-\[ping_3s_cubic-bezier\(0,0,0\.2,1\)_infinite\]" \/>[\s\S]*?<div className="absolute w-96 h-96 border border-teal-500\/5 rounded-full animate-\[ping_3s_cubic-bezier\(0,0,0\.2,1\)_infinite\] animation-delay-1000" \/>[\s\S]*?<\/div>/;

const newCircles = `{/* Decorative background circles */}
                {isThinking && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="w-64 h-64 border-2 border-dashed border-teal-500/20 rounded-full animate-[spin_8s_linear_infinite] opacity-60" />
                    <div className="absolute w-96 h-96 border-2 border-dashed border-teal-500/10 rounded-full animate-[spin_12s_linear_infinite_reverse] opacity-40" />
                    <div className="absolute w-72 h-72 border border-teal-500/20 rounded-full animate-pulse opacity-50" />
                  </div>
                )}`;
content = content.replace(oldCirclesRegex, newCircles);

// 3. Conditionally render AI is thinking text in central area
const oldAiTextRegex = /<p className="text-\[13px\] font-medium text-slate-500 mt-4[^>]*>AI is (speaking|thinking)\.\.\.<\/p>/g;
content = content.replace(oldAiTextRegex, '{isThinking && <p className="text-[13px] font-medium text-slate-500 mt-4 animate-pulse">AI is thinking...</p>}');

// 4. Conditionally render AI is thinking text in footer input
const oldFooterTextRegex = /\{false && \([\s\S]*?<div className="flex items-center gap-2 mb-3 px-2">[\s\S]*?<div className="w-1\.5 h-1\.5 rounded-full bg-teal-500 animate-pulse" \/>[\s\S]*?<p className="text-\[11px\] font-medium text-slate-500">AI is (speaking|thinking)\.\.\.<\/p>[\s\S]*?<\/div>[\s\S]*?\)\}/;
const newFooterText = `{isThinking && (
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <p className="text-[11px] font-medium text-slate-500 animate-pulse">AI is thinking...</p>
                </div>
              )}`;
content = content.replace(oldFooterTextRegex, newFooterText);


fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Updated AI indicator conditionals!");