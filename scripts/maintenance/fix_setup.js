const fs = require('fs');

let setupPath = 'src/components/candidate/CandidateSetupOptions.tsx';
let setupContent = fs.readFileSync(setupPath, 'utf8');

if (!setupContent.includes('export function CandidateSetupOptions({ existingProfile }: { existingProfile?: any }) {')) {
    setupContent = setupContent.replace('export function CandidateSetupOptions() {', 'export function CandidateSetupOptions({ existingProfile }: { existingProfile?: any }) {');
    
    // Instead of initializing to null, parsedProfile should probably start as existingProfile?
    // Wait, EditProfileDialog inside uses `profile={parsedProfile}`. It should use `parsedProfile || existingProfile`.
    setupContent = setupContent.replace('profile={parsedProfile}', 'profile={parsedProfile || existingProfile}');
    
    // Change "Enter Manually" to "Edit Profile" if existingProfile is present
    const btnTextOld = 'Enter Manually';
    const btnTextNew = '{existingProfile ? "Edit Profile" : "Enter Manually"}';
    setupContent = setupContent.replace(btnTextOld, btnTextNew);
    
    fs.writeFileSync(setupPath, setupContent, 'utf8');
    console.log("Updated CandidateSetupOptions.tsx");
}

let pagePath = 'src/app/(app)/candidate/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace('<CandidateSetupOptions />', '<CandidateSetupOptions existingProfile={profile} />');
fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log("Updated candidate/page.tsx");
