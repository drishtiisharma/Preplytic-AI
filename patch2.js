const fs = require('fs');
const file = 'src/app/(app)/interview/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import React from "react";\r?\nimport { PageContainer } from "@\/components\/layout\/PageContainer";/s, 
  'import React, { useState, useEffect } from "react";\nimport { createClient } from "@/lib/supabase/client";\nimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";\nimport { PageContainer } from "@/components/layout/PageContainer";'
);

content = content.replace(/export default function AIInterviewPage\(\) \{\r?\n  return \(/s, 
  'export default function AIInterviewPage() {\n  const supabase = createClient();\n  const [jobProfiles, setJobProfiles] = useState<any[]>([]);\n  const [selectedJobId, setSelectedJobId] = useState<string>("");\n\n  useEffect(() => {\n    async function loadJobs() {\n      const { data: { user } } = await supabase.auth.getUser();\n      if (!user) return;\n      const { data } = await supabase.from("job_profiles").select("id, title, company").eq("user_id", user.id).order("created_at", { ascending: false });\n      if (data) setJobProfiles(data);\n    }\n    loadJobs();\n  }, []);\n\n  return ('
);

content = content.replace(/<div className="space-y-1\.5">\r?\n\s*<label className="text-\[12px\] font-semibold text-slate-500 uppercase tracking-wider">Target Job<\/label>\r?\n\s*<div className="flex items-center gap-2\.5 bg-slate-50 dark:bg-slate-900\/50 p-2\.5 rounded-xl border border-slate-100 dark:border-border">\r?\n\s*<Briefcase className="w-4 h-4 text-teal-600" \/>\r?\n\s*<span className="text-\[14px\] font-semibold text-slate-700 dark:text-slate-200">\{setupData\.targetJob\}<\/span>\r?\n\s*<\/div>\r?\n\s*<\/div>/s,
  <div className="space-y-1.5">\n                  <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Target Job</label>\n                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>\n                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl border-slate-100 dark:border-border h-11 shadow-none">\n                      <SelectValue placeholder="Select Job Profile" />\n                    </SelectTrigger>\n                    <SelectContent>\n                      {jobProfiles.map((job: any) => (\n                        <SelectItem key={job.id} value={job.id}>{job.title} at {job.company}</SelectItem>\n                      ))}\n                    </SelectContent>\n                  </Select>\n                </div>
);

content = content.replace(/targetJob: "Software Engineer @ Google",\r?\n\s*/s, '');

fs.writeFileSync(file, content);
console.log("Regex replaced successfully");