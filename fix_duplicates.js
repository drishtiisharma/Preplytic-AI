const fs = require('fs');
const path = 'src/app/(app)/interview/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldStr = `  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});`;

const newStr = `  const [errors, setErrors] = useState<{ [key: string]: string }>({});`;

content = content.replace(oldStr, newStr);

// In case of \r\n issues
if (!content.includes(newStr) || content.includes(oldStr)) {
  content = content.replace(oldStr.replace(/\n/g, "\r\n"), newStr);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed duplicate declarations in interview page.");