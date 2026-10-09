import fs from 'fs';
let content = fs.readFileSync('src/components/candidate/MatchScoreCard.tsx', 'utf8');
content = content.replace('onValueChange={setSelectedJobId}', 'onValueChange={(val) => setSelectedJobId(val || "")}');
fs.writeFileSync('src/components/candidate/MatchScoreCard.tsx', content, 'utf8');
console.log("Fixed Select type error!");