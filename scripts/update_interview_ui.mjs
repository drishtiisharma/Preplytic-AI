import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Decorative circles
const oldCircles = `                {/* Decorative background circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div className="w-64 h-64 border border-teal-500/10 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="absolute w-96 h-96 border border-teal-500/5 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-1000" />
                </div>`;
const newCircles = `                {/* Decorative background circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div className="w-64 h-64 border-2 border-dashed border-teal-500/20 rounded-full animate-[spin_8s_linear_infinite] opacity-60" />
                  <div className="absolute w-96 h-96 border-2 border-dashed border-teal-500/10 rounded-full animate-[spin_12s_linear_infinite_reverse] opacity-40" />
                  <div className="absolute w-72 h-72 border border-teal-500/20 rounded-full animate-pulse opacity-50" />
                </div>`;
content = content.replace(oldCircles, newCircles);

// 2. AI is thinking
content = content.replace(
  '<p className="text-[13px] font-medium text-slate-500 mt-4">AI is speaking...</p>',
  '<p className="text-[13px] font-medium text-slate-500 mt-4 animate-pulse">AI is thinking...</p>'
);
content = content.replace(
  '<p className="text-[11px] font-medium text-slate-500">AI is speaking...</p>',
  '<p className="text-[11px] font-medium text-slate-500">AI is thinking...</p>'
);

// 3. Bottom controls buttons
const oldControls = `<div className="flex items-center justify-center gap-4">
                  <Button 
                      variant={isRecording ? "default" : "outline"}
                      size="icon" 
                      className={\`w-14 h-14 rounded-2xl border-slate-200 \${isRecording ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "text-slate-600 hover:bg-slate-50 bg-white"}\`}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessingVoice || isSubmitting}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                  
                    
                    <Button onClick={completeInterview} variant="destructive" className="h-14 px-8 rounded-2xl font-bold shadow-md shadow-red-500/20">
                    <PhoneOff className="w-5 h-5 mr-2" />
                    End Call
                  </Button>
                  <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                
                  {submitError && <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>}
                  {isProcessingVoice && <p className="text-teal-600 text-sm mt-4 text-center animate-pulse">Processing Voice Transcript...</p>}
                </div>`;
const newControls = `<div className="flex flex-col items-center justify-center gap-2">
                  {submitError && <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>}
                  {isProcessingVoice && <p className="text-teal-600 text-sm mt-4 text-center animate-pulse">Processing Voice Transcript...</p>}
                </div>`;
content = content.replace(oldControls, newControls);

// 4. Download icon
const oldDownload = `<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <Download className="w-4 h-4" />
              </Button>`;
content = content.replace(oldDownload, '');

// 5. Chat Input Volume Icon
const oldVolume = `<Button variant="outline" size="icon" className="shrink-0 h-11 w-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                  <Volume2 className="w-4 h-4" />
                </Button>`;
content = content.replace(oldVolume, '');

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Updated interview UI!");