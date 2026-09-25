const fs = require('fs');
let path = 'src/app/(app)/roadmap/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add hasInterview state
if (!content.includes('const [hasInterview')) {
    content = content.replace(
        'const [items, setItems] = useState<RoadmapItem[]>([]);',
        'const [items, setItems] = useState<RoadmapItem[]>([]);\n  const [hasInterview, setHasInterview] = useState<string | null>(null);\n  const [isRefining, setIsRefining] = useState(false);'
    );
}

// 2. Add useEffect to check for interview
const effectStr = `
  useEffect(() => {
    async function checkInterview() {
      if (!selectedJobId || !selectedResumeId) {
        setHasInterview(null);
        return;
      }
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      const { data } = await supabase
        .from('interview_sessions')
        .select('id')
        .eq('job_profile_id', selectedJobId)
        .eq('resume_id', selectedResumeId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setHasInterview(data.id);
      } else {
        setHasInterview(null);
      }
    }
    checkInterview();
  }, [selectedJobId, selectedResumeId, supabase]);
`;

if (!content.includes('function checkInterview')) {
    content = content.replace(
        '  const handleGenerate = async () => {',
        effectStr + '\n  const handleGenerate = async () => {'
    );
}

// 3. Add handleRefine
const refineStr = `
  const handleRefine = async () => {
    if (!roadmap || !hasInterview) return;
    setError(null);
    setIsRefining(true);
    try {
      const res = await fetch(\`/api/roadmap/\${roadmap.id}/sync-interview\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interview_session_id: hasInterview })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refinement failed.");
      
      // We expect the refined_roadmap schema returned directly for this test
      if (data.refined_roadmap) {
         setRoadmap({ ...roadmap, ...data.refined_roadmap, is_refined: true });
         setItems(data.refined_roadmap.phases.map((p: any, i: number) => ({...p, id: \`refined-\${i}\`})));
      } else if (data.data) {
         // Fallback if the backend actually persisted it
         setRoadmap(data.data);
         const activeVersion = data.data.roadmap_versions?.find((v: any) => v.version_number === data.data.current_version) || data.data.roadmap_versions?.[0];
         setItems((activeVersion?.roadmap_items || []).sort((a: any, b: any) => a.week_start - b.week_start));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRefining(false);
    }
  };
`;

if (!content.includes('const handleRefine')) {
    content = content.replace(
        '  const updateItemStatus = async',
        refineStr + '\n  const updateItemStatus = async'
    );
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated state logic in roadmap page");