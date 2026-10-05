const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8');

content = content.replace(
    'import { useEffect, useState } from "react";',
    'import { useEffect, useState, useRef } from "react";'
);

const stateDecs = `  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);`;

const stateReplacement = `${stateDecs}
  const hasGenerated = useRef(false);`;

content = content.replace(stateDecs, stateReplacement);

const genBlock = `        } else {
          // Report not found, generate it!
          const res = await fetch('/api/report/generate', {`;

const genReplacement = `        } else {
          // Report not found, generate it!
          if (hasGenerated.current) return;
          hasGenerated.current = true;
          
          const res = await fetch('/api/report/generate', {`;

content = content.replace(genBlock, genReplacement);

fs.writeFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', content, 'utf8');
console.log("Updated page.tsx with useRef guard");