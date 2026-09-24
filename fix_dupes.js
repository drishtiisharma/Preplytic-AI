const fs = require('fs');
const path = 'src/app/(app)/interview/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove duplicate useRouter import
content = content.replace(/import \{ useRouter \} from "next\/navigation";\r?\nimport \{ useRouter \} from "next\/navigation";/, 'import { useRouter } from "next/navigation";');

// 2. Remove duplicate router declaration
content = content.replace(/const router = useRouter\(\);\r?\n\s*const router = useRouter\(\);/, 'const router = useRouter();');

// 3. Remove duplicate errors declarations
content = content.replace(/const \[errors, setErrors\] = useState<\{[^\}]+\}>\(\{\}\);\r?\n\s*const \[errors, setErrors\] = useState<\{[^\}]+\}>\(\{\}\);\r?\n\s*const \[errors, setErrors\] = useState<\{[^\}]+\}>\(\{\}\);/g, 'const [errors, setErrors] = useState<{ [key: string]: string }>({});');
// fallback for two duplicates
content = content.replace(/const \[errors, setErrors\] = useState<\{[^\}]+\}>\(\{\}\);\r?\n\s*const \[errors, setErrors\] = useState<\{[^\}]+\}>\(\{\}\);/g, 'const [errors, setErrors] = useState<{ [key: string]: string }>({});');

// 4. Remove duplicate handleStartInterview
const startIdx1 = content.indexOf('const handleStartInterview = async () => {');
if (startIdx1 !== -1) {
    const startIdx2 = content.indexOf('const handleStartInterview = async () => {', startIdx1 + 10);
    if (startIdx2 !== -1) {
        // Find end of first handleStartInterview. It's followed by a blank line then the second one.
        // We can just remove from startIdx2 up to the return statement.
        const returnIdx = content.indexOf('return (', startIdx2);
        if (returnIdx !== -1) {
             content = content.substring(0, startIdx2) + content.substring(returnIdx);
        }
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed duplicates successfully.");