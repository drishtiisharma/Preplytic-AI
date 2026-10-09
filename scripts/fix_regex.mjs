import fs from 'fs';
let content = fs.readFileSync('src/components/candidate/MatchScoreCard.tsx', 'utf8');

content = content.replace(/split\(\/\[,\;\\n\]\/\)/g, "split(/[,;\\n]/)");
// Fix the actual messed up string in the file
content = content.replace("jobSkillsRaw.split(/[,;\n]/).map", "jobSkillsRaw.split(/[,;\\n]/).map");

fs.writeFileSync('src/components/candidate/MatchScoreCard.tsx', content, 'utf8');
console.log("Fixed regex syntax error!");