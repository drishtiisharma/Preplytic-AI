const fs = require('fs');
const path = 'src/app/(app)/interview/[sessionId]/report/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `        // Fetch report
        const { data: reportData, error: reportError } = await supabase
          .from("interview_reports")
          .select("*")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (reportError) {
          setError("Failed to fetch report data.");
        } else if (reportData) {
          setReport(reportData);
        }`;

const replacementStr = `        // Fetch report
        const { data: reportData, error: reportError } = await supabase
          .from("interview_reports")
          .select("*")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (reportError) {
          setError("Failed to fetch report data.");
        } else if (reportData) {
          setReport(reportData);
        } else {
          // Report not found, generate it!
          const res = await fetch('/api/report/generate', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ sessionId })
          });
          
          if (res.status === 501) {
             setError("LLM configuration missing. Please set OPENAI_API_KEY to generate reports.");
          } else if (res.ok) {
             const generationData = await res.json();
             setReport(generationData.report);
          } else {
             const errorData = await res.json();
             setError(errorData.error || "Failed to generate report.");
          }
        }`;

content = content.replace(targetStr, replacementStr);
// Normalize newlines for replacement if necessary
if (!content.includes('/api/report/generate')) {
  content = content.replace(targetStr.replace(/\n/g, "\r\n"), replacementStr.replace(/\n/g, "\r\n"));
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated Report generation trigger in UI.");