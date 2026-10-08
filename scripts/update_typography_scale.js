const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

const typographyOverrides = `
  /* Enhanced Typography Scale */
  --text-xs: 0.8125rem;
  --text-xs--line-height: 1.25rem;
  --text-sm: 0.9375rem;
  --text-sm--line-height: 1.375rem;
  --text-base: 1.125rem;
  --text-base--line-height: 1.7rem;
  --text-lg: 1.25rem;
  --text-lg--line-height: 1.8rem;
  --text-xl: 1.5rem;
  --text-xl--line-height: 2rem;
  --text-2xl: 1.875rem;
  --text-2xl--line-height: 2.3rem;
  --text-3xl: 2.25rem;
  --text-3xl--line-height: 2.75rem;
  --text-4xl: 3rem;
  --text-4xl--line-height: 3.5rem;
  --text-5xl: 3.75rem;
  --text-5xl--line-height: 4.2rem;
  --text-6xl: 4.5rem;
  --text-6xl--line-height: 4.8rem;
  --text-7xl: 5.5rem;
  --text-7xl--line-height: 5.8rem;
`;

// Insert it right after --color-mint-400: #34d399; inside @theme inline
if (content.includes('--color-mint-400: #34d399;')) {
    content = content.replace('--color-mint-400: #34d399;', '--color-mint-400: #34d399;\n' + typographyOverrides);
}

fs.writeFileSync('src/app/globals.css', content, 'utf8');
console.log("Injected new typography scale into globals.css!");