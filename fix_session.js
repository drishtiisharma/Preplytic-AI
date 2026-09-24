const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

// Fix duplicate imports
content = content.replace('import { useRouter } from "next/navigation";\r\nimport { useRouter } from "next/navigation";', 'import { useRouter } from "next/navigation";');
content = content.replace('import { useRouter } from "next/navigation";\nimport { useRouter } from "next/navigation";', 'import { useRouter } from "next/navigation";');

// Fix duplicate router instance
content = content.replace('  const router = useRouter();\r\n  const router = useRouter();', '  const router = useRouter();');
content = content.replace('  const router = useRouter();\n  const router = useRouter();', '  const router = useRouter();');

// Change function signature
const fnTarget = 'export default function AIInterviewPage() {';
const fnRep = 'export default function AIInterviewPage({ params }: { params: { sessionId: string } }) {\n  const { sessionId } = params;';
content = content.replace(fnTarget, fnRep);

// Inject useEffect
const effectInjectTarget = '  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Hard");\n  const [errors, setErrors] = useState<{ [key: string]: string }>({});';
const effectInjectRep =   const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Hard");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
        
      if (data && data.user_id === user.id) {
        setSelectedJobId(data.job_profile_id || "");
        setSelectedResumeId(data.resume_id || "");
        if (data.duration_minutes) {
          setSelectedDuration(\\ Minutes\);
        }
        if (data.difficulty) setSelectedDifficulty(data.difficulty);
        if (data.selected_jd_topics) setSelectedJobTopics(data.selected_jd_topics);
        if (data.selected_resume_topics) setSelectedResumeTopics(data.selected_resume_topics);
      }
    }
    if (sessionId) {
      loadSession();
    }
  }, [sessionId, supabase]);;
content = content.replace(effectInjectTarget, effectInjectRep);
content = content.replace(effectInjectTarget.replace(/\n/g, '\r\n'), effectInjectRep.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Session page updated.");