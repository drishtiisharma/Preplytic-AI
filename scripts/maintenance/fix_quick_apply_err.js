const fs = require('fs');
let path = 'src/app/(app)/quick-apply/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const detail = typeof errData.detail === "string" ? errData.detail : JSON.stringify(errData.detail);
        throw new Error(detail || "Failed to generate");
      }`;

// Replace the specific line I added for cold mail earlier
content = content.replace(
    'if (!response.ok) { const errData = await response.json().catch(() => ({})); throw new Error(errData.detail || "Failed to generate"); }',
    replacement
);

// Replace the original line for referral
content = content.replace(
    'if (!response.ok) throw new Error("Failed to generate");',
    replacement
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated error handling in quick-apply.");