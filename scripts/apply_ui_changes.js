const fs = require('fs');

// 1. Update layout.tsx for Inter font
let layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
layoutContent = layoutContent.replace(/import \{ Geist, Geist_Mono \} from "next\/font\/google";/, 'import { Inter, Geist_Mono } from "next/font/google";');
layoutContent = layoutContent.replace(/const geistSans = Geist\(\{\n  variable: "--font-geist-sans",\n  subsets: \["latin"\],\n\}\);/, `const interFont = Inter({\n  variable: "--font-sans",\n  subsets: ["latin"],\n});`);
layoutContent = layoutContent.replace(/\$\{geistSans\.variable\}/, '${interFont.variable}');
fs.writeFileSync('src/app/layout.tsx', layoutContent, 'utf8');

// 2. Update globals.css with new global typography scaling
let globalsContent = fs.readFileSync('src/app/globals.css', 'utf8');

const baseLayerReplacement = `@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground text-base md:text-lg;
  }
  html {
    @apply font-sans;
  }
  h1 {
    @apply text-5xl md:text-[4rem] font-extrabold tracking-tight leading-[1.1] mb-2;
  }
  h2 {
    @apply text-3xl md:text-[2.5rem] font-bold tracking-tight leading-snug mb-2;
  }
  h3 {
    @apply text-2xl md:text-[2rem] font-bold tracking-tight mb-2;
  }
  h4 {
    @apply text-xl md:text-2xl font-bold tracking-tight mb-2;
  }
  p {
    @apply leading-relaxed;
  }
}`;

globalsContent = globalsContent.replace(/@layer base \{[\s\S]*?\}/, baseLayerReplacement);
fs.writeFileSync('src/app/globals.css', globalsContent, 'utf8');

// 3. Update button.tsx
let buttonContent = fs.readFileSync('src/components/ui/button.tsx', 'utf8');
buttonContent = buttonContent.replace('rounded-lg border border-transparent', 'rounded-full border border-transparent');
// Make all default button sizes larger
buttonContent = buttonContent.replace(/default:\n\s*"h-8 gap-1.5 px-2.5/, 'default:\n          "h-11 gap-2 px-6 text-[15px]');
buttonContent = buttonContent.replace(/sm: "h-7 gap-1/, 'sm: "h-9 gap-1.5 px-4 text-sm');
buttonContent = buttonContent.replace(/lg: "h-9 gap-1.5 px-2.5/, 'lg: "h-14 gap-2.5 px-8 text-base');

fs.writeFileSync('src/components/ui/button.tsx', buttonContent, 'utf8');

console.log("Updated global typography and button styles!");