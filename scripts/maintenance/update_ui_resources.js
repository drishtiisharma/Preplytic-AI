const fs = require('fs');
let path = 'src/app/(app)/roadmap/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldResourceBlock = `{stage.resources?.length > 0 && (
                                    <div className="mt-4 border-t border-slate-100 dark:border-border pt-3">
                                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resources</p>
                                      <ul className="space-y-1">
                                        {stage.resources.map((res, i) => (
                                          <li key={i} className="text-[13px] text-teal-600 font-medium flex items-center gap-2">
                                            <Link2 className="w-3 h-3" /> {res}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}`;

const newResourceBlock = `{stage.resources?.length > 0 && (
                                    <div className="mt-4 border-t border-slate-100 dark:border-border pt-3">
                                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resources</p>
                                      <ul className="space-y-3">
                                        {stage.resources.map((res, i) => {
                                          let parsed = null;
                                          try {
                                            parsed = JSON.parse(res);
                                          } catch(e) {
                                            parsed = null;
                                          }
                                          
                                          if (parsed && parsed.title) {
                                            return (
                                              <li key={i} className="flex flex-col gap-1">
                                                <a href={parsed.url} target="_blank" rel="noreferrer" className="text-[13px] text-teal-600 hover:text-teal-700 font-bold flex items-start gap-1.5 leading-tight transition-colors">
                                                  <Link2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {parsed.title}
                                                </a>
                                                <p className="text-[12px] text-slate-500 pl-5 leading-snug">{parsed.description}</p>
                                              </li>
                                            );
                                          }
                                          
                                          return (
                                            <li key={i} className="text-[13px] text-teal-600 font-medium flex items-center gap-2">
                                              <Link2 className="w-3 h-3" /> {res}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  )}`;

content = content.replace(oldResourceBlock, newResourceBlock);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated roadmap page to render clickable resources");