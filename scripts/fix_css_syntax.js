const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

// Remove the leftover redundant block from the previous regex
const redundantBlock = `  p {
    @apply leading-relaxed;
  }
}
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}`;

const replacement = `  p {
    @apply leading-relaxed;
  }
}`;

content = content.replace(redundantBlock, replacement);
fs.writeFileSync('src/app/globals.css', content, 'utf8');
console.log("Fixed CSS syntax error!");