const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/job-profiles/create/page.tsx', 'utf8');

// Rename export default function CreateJobProfilePage() to function CreateJobProfileForm()
content = content.replace('export default function CreateJobProfilePage()', 'function CreateJobProfileForm()');

// Add import { Suspense } from "react";
content = content.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect, Suspense } from "react";');

// Append the export default function CreateJobProfilePage() at the end
content += `

export default function CreateJobProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading job profile form...</div>}>
      <CreateJobProfileForm />
    </Suspense>
  );
}
`;

fs.writeFileSync('src/app/(app)/job-profiles/create/page.tsx', content, 'utf8');
console.log("Added Suspense boundary to fix useSearchParams build error!");