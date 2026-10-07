const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Remove the volume button from the center area
const centerVolumeBtn = `                  <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                    <Volume2 className="w-5 h-5" />
                  </Button>`;
content = content.replace(centerVolumeBtn, '');

// 2. Add the current question to the transcript
const messagesEnd = `                  </div>
                  
                </div>
              ))}
            </div>`;

const newMessagesEnd = `                  </div>
                  
                </div>
              ))}
              
              {currentQ && (
                <div className="flex flex-col gap-1 max-w-[85%] mr-auto items-start">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-teal-600">
                    AI Interviewer
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-400">Now</span>
                  </div>
                  <div className="p-3.5 rounded-2xl text-[14px] leading-relaxed bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm">
                    {currentQ.question_text}
                  </div>
                </div>
              )}
            </div>`;
content = content.replace(messagesEnd, newMessagesEnd);

// 3. Replace the speaking indicator with the new Chat Input area
const speakingIndicatorRegex = /\{\/\*\s*Speaking Indicator\s*\*\/\}.*?<\/Card>/s;

const chatInputUI = `{/* Chat Input Area */}
            <div className="p-4 border-t border-slate-100 dark:border-border bg-white dark:bg-card shrink-0">
              {interviewState.isAiSpeaking && (
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <p className="text-[11px] font-medium text-slate-500">AI is speaking...</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="shrink-0 h-11 w-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 bg-white">
                  <Volume2 className="w-4 h-4" />
                </Button>
                <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="flex-1 bg-transparent border-none text-sm px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && answer.trim()) {
                        handleAnswerSubmit();
                      }
                    }}
                    disabled={isSubmitting || isProcessingVoice}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-none h-full px-4 hover:bg-transparent text-teal-600"
                    onClick={handleAnswerSubmit}
                    disabled={!answer.trim() || isSubmitting || isProcessingVoice}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  </Button>
                </div>
              </div>
            </div>
          </Card>`;

content = content.replace(speakingIndicatorRegex, chatInputUI);

// Fix the garbled dot character in existing messages mapping
content = content.replace(/ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢.*Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢/g, '•');

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Updated Chat UI!");