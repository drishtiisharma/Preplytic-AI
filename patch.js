const fs = require('fs');
const file = 'src/app/(app)/interview/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const importTarget = 'import React from "react";\r\nimport { PageContainer } from "@/components/layout/PageContainer";';
const importReplacement = 'import React, { useState, useEffect } from "react";\r\nimport { createClient } from "@/lib/supabase/client";\r\nimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";\r\nimport { PageContainer } from "@/components/layout/PageContainer";';

const functionTarget = 'export default function AIInterviewPage() {\r\n  return (';
const functionReplacement = 'export default function AIInterviewPage() {\r\n  const supabase = createClient();\r\n  const [jobProfiles, setJobProfiles] = useState<any[]>([]);\r\n  const [selectedJobId, setSelectedJobId] = useState<string>("");\r\n\r\n  useEffect(() => {\r\n    async function loadJobs() {\r\n      const { data: { user } } = await supabase.auth.getUser();\r\n      if (!user) return;\r\n      const { data } = await supabase.from("job_profiles").select("id, title, company").eq("user_id", user.id).order("created_at", { ascending: false });\r\n      if (data) setJobProfiles(data);\r\n    }\r\n    loadJobs();\r\n  }, []);\r\n\r\n  return (';

const divTarget = '                <div className="space-y-1.5">\r\n                  <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Target Job</label>\r\n                  <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-border">\r\n                    <Briefcase className="w-4 h-4 text-teal-600" />\r\n                    <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">{setupData.targetJob}</span>\r\n                  </div>\r\n                </div>';

const divReplacement = '                <div className="space-y-1.5">\r\n                  <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Target Job</label>\r\n                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>\r\n                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-border h-11 shadow-none">\r\n                      <SelectValue placeholder="Select Job Profile" />\r\n                    </SelectTrigger>\r\n                    <SelectContent>\r\n                      {jobProfiles.map(job => (\r\n                        <SelectItem key={job.id} value={job.id}>{job.title} at {job.company}</SelectItem>\r\n                      ))}\r\n                    </SelectContent>\r\n                  </Select>\r\n                </div>';

content = content.replace(importTarget, importReplacement);
content = content.replace(functionTarget, functionReplacement);
content = content.replace(divTarget, divReplacement);

fs.writeFileSync(file, content);
console.log("Replaced successfully");