CREATE POLICY "Users can insert questions into their own sessions" 
ON public.interview_questions
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.interview_sessions
    WHERE interview_sessions.id = interview_questions.session_id
    AND interview_sessions.user_id = auth.uid()
  )
);