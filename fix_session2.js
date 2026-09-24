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
const fnRep = Buffer.from('ZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQUlJbnRlcnZpZXdQYWdlKHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IHNlc3Npb25JZDogc3RyaW5nIH0gfSkgew0KICBjb25zdCB7IHNlc3Npb25JZCB9ID0gcGFyYW1zOw==', 'base64').toString('utf8');
content = content.replace(fnTarget, fnRep);

// Inject useEffect
const effectInjectTarget = Buffer.from('ICBjb25zdCBbZXJyb3JzLCBzZXRFcnJvcnNdID0gdXNlU3RhdGU8eyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfT4oe30pOw==', 'base64').toString('utf8');
const effectInjectRep = Buffer.from('ICBjb25zdCBbZXJyb3JzLCBzZXRFcnJvcnNdID0gdXNlU3RhdGU8eyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfT4oe30pOw0KDQogIHVzZUVmZmVjdCgoKSA9PiB7DQogICAgYXN5bmMgZnVuY3Rpb24gbG9hZFNlc3Npb24oKSB7DQogICAgICBjb25zdCB7IGRhdGE6IHsgdXNlciB9IH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTsNCiAgICAgIGlmICghdXNlcikgcmV0dXJuOw0KICAgICAgDQogICAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZQ0KICAgICAgICAuZnJvbSgnaW50ZXJ2aWV3X3Nlc3Npb25zJykNCiAgICAgICAgLnNlbGVjdCgnKicpDQogICAgICAgIC5lcSgnaWQnLCBzZXNzaW9uSWQpDQogICAgICAgIC5zaW5nbGUoKTsNCiAgICAgICAgDQogICAgICBpZiAoZGF0YSAmJiBkYXRhLnVzZXJfaWQgPT09IHVzZXIuaWQpIHsNCiAgICAgICAgc2V0U2VsZWN0ZWRKb2JJZChkYXRhLmpvYl9wcm9maWxlX2lkIHx8ICIiKTsNCiAgICAgICAgc2V0U2VsZWN0ZWRSZXN1bWVJZChkYXRhLnJlc3VtZV9pZCB8fCAiIik7DQogICAgICAgIGlmIChkYXRhLmR1cmF0aW9uX21pbnV0ZXMpIHsNCiAgICAgICAgICBzZXRTZWxlY3RlZER1cmF0aW9uKGAke2RhdGEuZHVyYXRpb25fbWludXRlc30gTWludXRlc2ApOw0KICAgICAgICB9DQogICAgICAgIGlmIChkYXRhLmRpZmZpY3VsdHkpIHNldFNlbGVjdGVkRGlmZmljdWx0eShkYXRhLmRpZmZpY3VsdHkpOw0KICAgICAgICBpZiAoZGF0YS5zZWxlY3RlZF9qZF90b3BpY3MpIHNldFNlbGVjdGVkSm9iVG9waWNzKGRhdGEuc2VsZWN0ZWRfamRfdG9waWNzKTsNCiAgICAgICAgaWYgKGRhdGEuc2VsZWN0ZWRfcmVzdW1lX3RvcGljcykgc2V0U2VsZWN0ZWRSZXN1bWVUb3BpY3MoZGF0YS5zZWxlY3RlZF9yZXN1bWVfdG9waWNzKTsNCiAgICAgIH0NCiAgICB9DQogICAgaWYgKHNlc3Npb25JZCkgew0KICAgICAgbG9hZFNlc3Npb24oKTsNCiAgICB9DQogIH0sIFtzZXNzaW9uSWQsIHN1cGFiYXNlXSk7', 'base64').toString('utf8');

content = content.replace(effectInjectTarget, effectInjectRep).replace(effectInjectTarget.replace(/\r\n/g, '\n'), effectInjectRep.replace(/\r\n/g, '\n'));

fs.writeFileSync('src/app/(app)/interview/[sessionId]/page.tsx', content, 'utf8');
console.log("Session page updated.");