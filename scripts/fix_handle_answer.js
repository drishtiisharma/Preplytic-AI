const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const regex = /const handleAnswerSubmit = async \(\) => \{[\s\S]*?catch \(err\) \{[\s\S]*?setIsSubmitting\(false\);\n\s*\}\n\s*\};/;

const replacement = `const handleAnswerSubmit = async () => {
    if (!currentQ || !answer.trim()) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: sData } = await supabase.from('interview_sessions').select('*').eq('id', sessionId).single();
      const { data: jData } = await supabase.from('job_profiles').select('*').eq('id', sData.job_profile_id).single();
      const { data: rData } = await supabase.from('resume_records').select('*').eq('id', sData.resume_id).single();

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'ai', text: currentQ.question_text, time: timeStr },
        { id: (Date.now() + 1).toString(), sender: 'user', text: answer, time: timeStr }
      ]);

      const response = await fetch("http://localhost:8000/generate/interview-evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": \`Bearer \${session?.access_token}\`
        },
        body: JSON.stringify({
          question: currentQ.question_text,
          answer: answer,
          job_profile: jData,
          resume_data: rData,
          difficulty: sData.difficulty || "Medium"
        })
      });

      let evaluation = null;
      if (response.ok) {
        const result = await response.json();
        evaluation = result.evaluation;
      } else {
        console.warn("Evaluation failed", await response.text());
      }

      const { data, error } = await supabase
        .from('interview_responses')
        .insert({
          session_id: sessionId,
          question_id: currentQ.id,
          response_text: answer,
          evaluation: evaluation
        })
        .select()
        .single();
        
      if (error) {
        console.error(error);
        setSubmitError("Failed to save answer.");
        setIsSubmitting(false);
        return;
      }
      
      if (data) {
        setResponses(prev => [...prev, data]);
        setAnswer("");
        
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsSubmitting(false);
        } else {
          await completeInterview();
        }
      } else {
        setIsSubmitting(false);
      }
    } catch (err) {
       console.error("Submit error", err);
       setSubmitError("Failed to save answer.");
       setIsSubmitting(false);
    }
  };`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
    console.log("Updated handleAnswerSubmit logic!");
} else {
    console.log("Regex not matched!");
}