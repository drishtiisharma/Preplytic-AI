import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// 1. Add useRef and auto-scroll logic
const effectCode = `  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);`;

content = content.replace('  const currentQ = questions[currentQuestionIndex];', effectCode + '\n  const currentQ = questions[currentQuestionIndex];');

// 2. Add ref div at the end of messages container
const messagesEndHtml = `                  </div>
                  
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>`;
content = content.replace('                  </div>\n                  \n                </div>\n              ))}\n            </div>', messagesEndHtml);

// 3. Fix grid expanding: add min-h-0 to the transcript Card
const cardOld = `<Card className="rounded-3xl border-slate-200 shadow-sm bg-white dark:bg-card flex flex-col overflow-hidden xl:col-span-1 lg:col-span-2 hidden lg:flex">`;
const cardNew = `<Card className="rounded-3xl border-slate-200 shadow-sm bg-white dark:bg-card flex flex-col overflow-hidden xl:col-span-1 lg:col-span-2 hidden lg:flex min-h-0 h-full max-h-full">`;
content = content.replace(cardOld, cardNew);

// Also fix the other column (AI Interviewer Column) just in case
const aiCardOld = `<Card className="flex-1 rounded-3xl border-slate-200 shadow-sm bg-white dark:bg-card overflow-hidden flex flex-col relative min-h-[400px]">`;
const aiCardNew = `<Card className="flex-1 rounded-3xl border-slate-200 shadow-sm bg-white dark:bg-card overflow-hidden flex flex-col relative min-h-[400px] min-h-0 h-full max-h-full">`;
content = content.replace(aiCardOld, aiCardNew);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Updated scrolling logic!");