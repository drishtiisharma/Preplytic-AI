import fs from 'fs';
const content = fs.readFileSync('src/app/(app)/interview/[sessionId]/page.tsx', 'utf8');

const checks = {
  hasMic: content.includes('<Mic '),
  hasMicOff: content.includes('<MicOff '),
  hasPhoneOff: content.includes('<PhoneOff '),
  hasDownload: content.includes('<Download '),
  hasVolume2: content.includes('<Volume2 '),
  isSpeaking: content.includes('AI is speaking...')
};

console.log(JSON.stringify(checks, null, 2));