import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

// 1. Remove Decorative circles
content = content.replace(
  /<div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">[\s\S]*?<div className="w-64 h-64 border border-teal-500\/10 rounded-full animate-\[ping_3s_cubic-bezier\(0,0,0\.2,1\)_infinite\]" \/>[\s\S]*?<div className="absolute w-96 h-96 border border-teal-500\/5 rounded-full animate-\[ping_3s_cubic-bezier\(0,0,0\.2,1\)_infinite\] animation-delay-1000" \/>[\s\S]*?<\/div>/g,
  ``
);

// 2. Remove AI is speaking... (Central)
content = content.replace(
  /<p className="text-\[13px\] font-medium text-slate-500 mt-4">AI is speaking\.\.\.<\/p>/g,
  ``
);

// 3. Remove AI is speaking... (Footer)
content = content.replace(
  /\{true && \(\s*<div className="flex items-center gap-2 mb-3 px-2">[\s\S]*?<p className="text-\[11px\] font-medium text-slate-500">AI is speaking\.\.\.<\/p>[\s\S]*?<\/div>\s*\)\}/g,
  ``
);
content = content.replace(
  /<div className="flex items-center gap-2 mb-3 px-2">[\s\S]*?<div className="w-1\.5 h-1\.5 rounded-full bg-teal-500 animate-pulse" \/>[\s\S]*?<p className="text-\[11px\] font-medium text-slate-500">AI is speaking\.\.\.<\/p>[\s\S]*?<\/div>/g,
  ``
);


// 4. Remove Mic & PhoneOff & Volume2 in bottom controls
const oldControls = `<div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button variant="destructive" className="h-14 px-8 rounded-2xl font-bold shadow-md shadow-red-500/20">
                    <PhoneOff className="w-5 h-5 mr-2" />
                    End Call
                  </Button>
                  <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>`;
const newControls = `<div className="flex flex-col items-center justify-center gap-2"></div>`;
content = content.replace(oldControls, newControls);

// 5. Remove Download Icon
content = content.replace(
  /<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">\s*<Download className="w-4 h-4" \/>\s*<\/Button>/g,
  ``
);

// 6. Remove Volume2 Icon in Chat Input
content = content.replace(
  /<Button variant="outline" size="icon" className="shrink-0 h-11 w-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">\s*<Volume2 className="w-4 h-4" \/>\s*<\/Button>/g,
  ``
);

// 7. Remove Volume2 inside the central Bot avatar
content = content.replace(
  /\{true && \(\s*<div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">\s*<Volume2 className="w-3 h-3 text-white" \/>\s*<\/div>\s*\)\}/g,
  ``
);
content = content.replace(
  /<div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">\s*<Volume2 className="w-3 h-3 text-white" \/>\s*<\/div>/g,
  ``
);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');

const checks = {
  hasMic: content.includes('<Mic '),
  hasMicOff: content.includes('<MicOff '),
  hasPhoneOff: content.includes('<PhoneOff '),
  hasDownload: content.includes('<Download '),
  hasVolume2: content.includes('<Volume2 '),
  isSpeaking: content.includes('AI is speaking...')
};
console.log(JSON.stringify(checks, null, 2));