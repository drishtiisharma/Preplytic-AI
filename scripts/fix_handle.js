const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx', 'utf8');

const regex = /const \{ data, error \} = await supabase\s*\.from\("interview_sessions"\)\s*\.insert\([\s\S]*?\)[\s\S]*?\.single\(\);[\s\S]*?if \(error\) \{[\s\S]*?\} else if \(data\) \{[\s\S]*?router\.push\(\`\/interview\/\$\{data\.id\}\`\);[\s\S]*?\}/;

const replacement = `const { data, error } = await supabase
          .from("interview_sessions")
          .insert({
            user_id: user.id,
            job_profile_id: selectedJobId,
            resume_id: selectedResumeId,
            number_of_questions: questionsCount,
            selected_jd_topics: selectedJobTopics,
            selected_resume_topics: selectedResumeTopics,
            difficulty: selectedDifficulty,
            status: "created"
          })
          .select()
          .single();

        if (error) {
          console.error(error);
          setErrors({ submit: "Failed to create interview session. Please try again." });
        } else if (data) {
          try {
            // Fetch Job Profile
            const { data: jobProfile, error: jobError } = await supabase
              .from('job_profiles')
              .select('job_description, title, company')
              .eq('id', selectedJobId)
              .single();

            if (jobError || !jobProfile) {
              setErrors({ submit: "Failed to load Job Profile data." });
              return;
            }

            // Fetch Resume
            const { data: resumeRecord, error: resumeError } = await supabase
              .from('resume_records')
              .select('*')
              .eq('id', selectedResumeId)
              .single();

            if (resumeError || !resumeRecord) {
              setErrors({ submit: "Failed to load Resume data." });
              return;
            }

            // Generate Questions via Python Backend
            const payload = {
              number_of_questions: questionsCount,
              difficulty: selectedDifficulty,
              selected_jd_topics: selectedJobTopics,
              selected_resume_topics: selectedResumeTopics,
              job_profile: jobProfile.job_description || JSON.stringify(jobProfile),
              resume_data: JSON.stringify(resumeRecord)
            };

            const response = await fetch("http://localhost:8000/generate/interview-questions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Pass auth token if needed? The backend requires Authorization header!
              },
              body: JSON.stringify(payload)
            });

            if (!response.ok) {
              const errText = await response.text();
              console.error("AI Generation Error:", errText);
              setErrors({ submit: "Failed to generate interview questions. AI backend error." });
              return;
            }

            const aiData = await response.json();
            const generatedQuestions = aiData.questions || [];

            if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
              setErrors({ submit: "AI generated an empty or invalid question set." });
              return;
            }

            // Insert questions into interview_questions
            const questionsToInsert = generatedQuestions.map((q, index) => ({
              session_id: data.id,
              question_text: typeof q === 'string' ? q : JSON.stringify(q),
              order_index: index + 1 // Assuming order_index exists, if not we rely on created_at
            }));

            const { error: insertError } = await supabase
              .from('interview_questions')
              .insert(questionsToInsert);

            if (insertError) {
              console.error("Question Insert Error:", insertError);
              setErrors({ submit: "Failed to save generated questions to the database." });
              return;
            }

            // Finally, navigate
            router.push(\`/interview/\${data.id}\`);
          } catch (genErr) {
            console.error("Generation/Insertion Error:", genErr);
            setErrors({ submit: "An unexpected error occurred during question generation." });
            return;
          }
        }`;

// We need to fetch the session token to pass to the backend because main.py expects it.
// Wait, the backend main.py expects:
// async def generate_interview_questions(req: InterviewGenerateRequest, authorization: str = Header(None)):
// if not authorization or not authorization.startswith("Bearer "): raise HTTPException(status_code=401)
// So we must pass the session access token!
const replacementWithAuth = replacement.replace(
  /"Content-Type": "application\/json",/,
  `"Content-Type": "application/json",
                "Authorization": \`Bearer \${(await supabase.auth.getSession()).data.session?.access_token}\``
);

content = content.replace(regex, replacementWithAuth);
fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');
console.log("Updated page.tsx!");