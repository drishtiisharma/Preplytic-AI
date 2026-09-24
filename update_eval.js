const fs = require('fs');
const path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. We must delete the FIRST occurrence of completeInterview and handleAnswerSubmit which seem to be floating.
// Let's just locate the first handleAnswerSubmit block and the second one, and replace them properly.

const completeInterviewStr =   const completeInterview = async () => {
    setIsCompleting(true);
    setSubmitError("");
    
    const { error } = await supabase
      .from('interview_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);
      
    if (error) {
      console.error(error);
      setSubmitError("Failed to complete interview.");
      setIsCompleting(false);
    } else {
      router.push(\/interview/\/report\);
    }
  };;

const handleAnswerSubmitStr =   const handleAnswerSubmit = async () => {
    if (!currentQ || !answer.trim()) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    const { data, error } = await supabase
      .from('interview_responses')
      .insert({
        session_id: sessionId,
        question_id: currentQ.id,
        response_text: answer
      })
      .select()
      .single();
      
    if (error) {
      console.error(error);
      setSubmitError("Failed to save answer.");
    } else if (data) {
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
  };;

const newHandleAnswerSubmitStr =   const handleAnswerSubmit = async () => {
    if (!currentQ || !answer.trim()) return;
    
    setIsSubmitting(true);
    setSubmitError("");
    
    // Mock AI Answer Evaluation
    const wordCount = answer.trim().split(/\\s+/).length;
    const score = Math.min(10, Math.max(1, Math.floor(wordCount / 10) + 2)); 
    
    const mockEvaluation = {
      score: score,
      feedback: "Your answer provides a reasonable starting point but could be more detailed. Consider using the STAR method for future responses.",
      strengths: ["Clear communication", "Relevant to the topic"],
      weaknesses: ["Lacks depth", "Needs more specific examples"]
    };
    
    const { data, error } = await supabase
      .from('interview_responses')
      .insert({
        session_id: sessionId,
        question_id: currentQ.id,
        transcript: answer,
        score: mockEvaluation.score,
        feedback: mockEvaluation.feedback,
        strengths: mockEvaluation.strengths,
        weaknesses: mockEvaluation.weaknesses
      })
      .select()
      .single();
      
    if (error) {
      console.error(error);
      setSubmitError("Failed to evaluate and save answer.");
    } else if (data) {
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
  };;

// We'll replace ALL occurrences of handleAnswerSubmitStr with nothing, then inject the new one in the right place.
content = content.split(handleAnswerSubmitStr).join("");
// We also have duplicates of completeInterviewStr it seems!
content = content.split(completeInterviewStr).join("");

// Now we re-insert them exactly once right after the useEffect for existingResponse.
const insertionPoint =   useEffect(() => {
    if (existingResponse) {
      setAnswer(existingResponse.transcript || existingResponse.response_text || "");
    } else {
      setAnswer("");
    }
  }, [currentQuestionIndex, existingResponse]);;

// But wait, existingResponse currently uses existingResponse.response_text which we also need to change to 	ranscript.
const oldInsertionPoint =   useEffect(() => {
    if (existingResponse) {
      setAnswer(existingResponse.response_text || "");
    } else {
      setAnswer("");
    }
  }, [currentQuestionIndex, existingResponse]);;

content = content.replace(oldInsertionPoint, insertionPoint + "\n\n" + completeInterviewStr + "\n\n" + newHandleAnswerSubmitStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated AI Answer Evaluation.");