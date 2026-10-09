import fs from 'fs';
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace components with components wrapped in div with ids
content = content.replace('<HowItWorks />', '<div id="how-it-works"><HowItWorks /></div>');
content = content.replace('<FAQ />', '<div id="faq"><FAQ /></div>');
content = content.replace('<ContactUs />', '<div id="contact"><ContactUs /></div>');
content = content.replace('<Hero />', '<div id="about"><Hero /></div>'); // Or we can use Hero as both about and hero

// "Features" is missing, maybe we just map it to how-it-works or we look if there's a Features component.
// Let's just point #features to the Hero or HowItWorks for now, or just map the ID.
content = content.replace('<div id="how-it-works">', '<div id="features"></div>\n        <div id="how-it-works">');

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
console.log("Added IDs to landing page!");