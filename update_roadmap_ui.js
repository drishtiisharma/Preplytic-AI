const fs = require('fs');
const path = 'src/app/(app)/roadmap/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldHandleGenerate = `  const handleGenerate = async () => {
    if (!selectedJobId || !selectedResumeId) {
      setError("Please select both a job profile and a resume.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setRoadmap(null);
    setItems([]);

    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_profile_id: selectedJobId, resume_record_id: selectedResumeId })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      
      setRoadmap(data.data);
      // Sort items by week_start
      const sortedItems = (data.data.roadmap_versions[0]?.roadmap_items || []).sort((a: any, b: any) => a.week_start - b.week_start);
      setItems(sortedItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };`;

const newHandleGenerate = `  const handleGenerate = async () => {
    if (!selectedJobId || !selectedResumeId) {
      setError("Please select both a job profile and a resume.");
      return;
    }
    setError(null);
    setIsGenerating(true);

    try {
      let res;
      // If we already have a roadmap for this exact combo, a second click means 'update version'
      if (roadmap && roadmap.job_profile_id === selectedJobId && roadmap.resume_record_id === selectedResumeId) {
         res = await fetch(\`/api/roadmap/\${roadmap.id}/versions\`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
         });
      } else {
         // Reset state if selecting a different combo
         setRoadmap(null);
         setItems([]);
         res = await fetch("/api/roadmap/generate", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ job_profile_id: selectedJobId, resume_record_id: selectedResumeId })
         });
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      
      setRoadmap(data.data);
      // Ensure we extract items from the active version
      const activeVersion = data.data.roadmap_versions?.find((v: any) => v.version_number === data.data.current_version) || data.data.roadmap_versions?.[0];
      const sortedItems = (activeVersion?.roadmap_items || []).sort((a: any, b: any) => a.week_start - b.week_start);
      setItems(sortedItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };`;

content = content.replace(oldHandleGenerate, newHandleGenerate);
if (!content.includes('const activeVersion =')) {
   content = content.replace(oldHandleGenerate.replace(/\n/g, "\r\n"), newHandleGenerate.replace(/\n/g, "\r\n"));
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated handleGenerate for roadmap UI reliability.");