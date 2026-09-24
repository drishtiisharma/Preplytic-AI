const fs = require('fs');
const path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject state variables at the beginning of the component
const stateTarget = const [submitError, setSubmitError] = useState<string>("");;
const stateInjection = const [submitError, setSubmitError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  
  // TTS Effect
  useEffect(() => {
    if (currentQ?.question_text && !existingResponse) {
      fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentQ.question_text })
      }).then(res => {
         if (res.status === 501) {
            console.warn("TTS configuration missing.");
         } else if (res.ok) {
            res.blob().then(blob => {
               const audioUrl = URL.createObjectURL(blob);
               const audio = new Audio(audioUrl);
               // audio.play().catch(e => console.warn("Audio autoplay blocked"));
            });
         }
      }).catch(console.error);
    }
  }, [currentQ?.question_text, existingResponse]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setIsProcessingVoice(true);
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          const res = await fetch('/api/stt', { method: 'POST', body: formData });
          if (res.status === 501) {
             setSubmitError("STT configuration missing. Please set STT_API_KEY.");
             // Fallback simulated transcript
             setAnswer("Simulated transcript because STT is missing.");
          } else {
             const data = await res.json();
             if (data.transcript) {
                setAnswer(data.transcript);
             }
          }
        } catch (e) {
           setSubmitError("Failed to process audio.");
        } finally {
           setIsProcessingVoice(false);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setSubmitError("Microphone access denied.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };
;

content = content.replace(stateTarget, stateInjection);

// 2. Replace Mic button
// Find the exact Mic button markup
const micBtnTargetRegex = /<Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-slate-200\s+text-slate-600 hover:bg-slate-50 bg-white">\s*<Mic className="w-5 h-5" \/>\s*<\/Button>/;

const newMicBtn = <Button 
                      variant={isRecording ? "default" : "outline"}
                      size="icon" 
                      className={\w-14 h-14 rounded-2xl border-slate-200 \\}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessingVoice || isSubmitting}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>;

content = content.replace(micBtnTargetRegex, newMicBtn);

// 3. Add Submit Answer button next to End Call if we have an answer loaded
const endCallRegex = /<Button variant="destructive" className="h-14 px-8 rounded-2xl font-bold shadow-md\s+shadow-red-500\/20">/g;

const submitBtnMarkup = {answer && !existingResponse && (
                      <Button 
                        onClick={handleAnswerSubmit} 
                        disabled={isSubmitting || isProcessingVoice}
                        className="h-14 px-8 rounded-2xl font-bold shadow-md bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        {isSubmitting ? "Evaluating..." : "Submit Answer"}
                      </Button>
                    )}
                    
                    <Button onClick={completeInterview} variant="destructive" className="h-14 px-8 rounded-2xl font-bold shadow-md shadow-red-500/20">;

content = content.replace(endCallRegex, submitBtnMarkup);

// 4. Also show isProcessingVoice state
const errorDisplayRegex = /{submitError && \(\s*<p className="text-red-500 text-sm mt-4 text-center">{submitError}<\/p>\s*\)}/g;
if (!content.match(errorDisplayRegex)) {
  // Try to insert it below the controls if not found
  const controlsEnd = /<\/div>\s*<\/div>\s*<\/Card>/g;
  content = content.replace(controlsEnd, 
                  {submitError && <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>}
                  {isProcessingVoice && <p className="text-teal-600 text-sm mt-4 text-center animate-pulse">Processing Voice Transcript...</p>}
                </div>
              </div>
            </Card>);
} else {
  content = content.replace(errorDisplayRegex, {submitError && <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>}\n{isProcessingVoice && <p className="text-teal-600 text-sm mt-4 text-center animate-pulse">Processing Voice Transcript...</p>});
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated UI for Voice Interview Integration.");