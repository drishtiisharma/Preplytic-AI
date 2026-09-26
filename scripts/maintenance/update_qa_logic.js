const fs = require('fs');
let path = 'src/app/(app)/quick-apply/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the Promise.all
let targetPromiseAll = `const [jobsRes, resumesRes] = await Promise.all([
        supabase.from('job_profiles').select('*').eq('user_id', userData.user.id).order('created_at', { ascending: false }),
        supabase.from('resume_records').select('*').eq('user_id', userData.user.id).order('uploaded_at', { ascending: false })
      ]);`;
      
let replacementPromiseAll = `const [jobsRes, resumesRes, profileRes] = await Promise.all([
        supabase.from('job_profiles').select('*').eq('user_id', userData.user.id).order('created_at', { ascending: false }),
        supabase.from('resume_records').select('*').eq('user_id', userData.user.id).order('uploaded_at', { ascending: false }),
        supabase.from('candidate_profiles').select('*').eq('user_id', userData.user.id).limit(1)
      ]);
      setCandidateProfile(profileRes.data?.[0] || null);`;

content = content.replace(targetPromiseAll, replacementPromiseAll);

// Add error handling to handleGenerateColdMail
let targetColdMail = `const handleGenerateColdMail = async () => {
    setIsGeneratingColdMail(true);
    try {
      const job = jobProfiles.find(j => j.id === selectedJobId);`;
      
let replacementColdMail = `const handleGenerateColdMail = async () => {
    if (!candidateProfile) {
      toast.error("Please set up your candidate profile first in the Candidate tab.");
      return;
    }
    setIsGeneratingColdMail(true);
    try {
      const job = jobProfiles.find(j => j.id === selectedJobId);`;

content = content.replace(targetColdMail, replacementColdMail);

// Add error handling to handleGenerateReferral
let targetReferral = `const handleGenerateReferral = async () => {
    setIsGeneratingReferral(true);
    try {
      const job = jobProfiles.find(j => j.id === selectedJobId);`;
      
let replacementReferral = `const handleGenerateReferral = async () => {
    if (!candidateProfile) {
      toast.error("Please set up your candidate profile first in the Candidate tab.");
      return;
    }
    setIsGeneratingReferral(true);
    try {
      const job = jobProfiles.find(j => j.id === selectedJobId);`;

content = content.replace(targetReferral, replacementReferral);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated quick-apply logic.");