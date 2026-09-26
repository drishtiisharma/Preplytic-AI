const fs = require('fs');
let path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

let lines = content.split('\n');
let newLines = [];
let seen = new Set();
// We'll just carefully remove duplicated lines in the declarations block
let inDeclarations = true;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // specifically target known duplicated lines exactly
    if (line.includes('const [isCompleting, setIsCompleting] = useState<boolean>(false);')) {
        if (seen.has('isCompleting')) continue;
        seen.add('isCompleting');
    }
    if (line.includes('const [responses, setResponses] = useState<any[]>([]);')) {
        if (seen.has('responses')) continue;
        seen.add('responses');
    }
    if (line.includes('const [answer, setAnswer] = useState<string>("");')) {
        if (seen.has('answer')) continue;
        seen.add('answer');
    }
    if (line.includes('const [isSubmitting, setIsSubmitting] = useState<boolean>(false);')) {
        if (seen.has('isSubmitting')) continue;
        seen.add('isSubmitting');
    }
    if (line.includes('const [submitError, setSubmitError] = useState<string>("");')) {
        if (seen.has('submitError')) continue;
        seen.add('submitError');
    }
    if (line.includes('const [questions, setQuestions] = useState<any[]>([]);')) {
        if (seen.has('questions')) continue;
        seen.add('questions');
    }
    if (line.includes('const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);')) {
        if (seen.has('currentQuestionIndex')) continue;
        seen.add('currentQuestionIndex');
    }
    if (line.includes('const [questionsLoading, setQuestionsLoading] = useState<boolean>(true);')) {
        if (seen.has('questionsLoading')) continue;
        seen.add('questionsLoading');
    }
    if (line.includes('const [questionsError, setQuestionsError] = useState<string>("");')) {
        if (seen.has('questionsError')) continue;
        seen.add('questionsError');
    }
    if (line.includes('const [errors, setErrors] = useState<{ [key: string]: string }>({});')) {
        if (seen.has('errors')) continue;
        seen.add('errors');
    }

    newLines.push(line);
}

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log("Removed duplicated state declarations.");