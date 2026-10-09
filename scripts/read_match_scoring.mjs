import fs from 'fs';
console.log(fs.readFileSync('src/components/candidate/MatchScoreCard.tsx', 'utf8').substring(500, 2000));