import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/candidate/page.tsx', 'utf8');

// Replace import
content = content.replace(
  'import { MatchScoreCard } from "@/components/candidate/MatchScoreCard";',
  'import { CandidateDashboardContent } from "@/components/candidate/CandidateDashboardContent";'
);

// Delete TopSkills logic
const topSkillsLogic = `  const topSkills = (profile?.skills || []).slice(0, 5).map((s: string) => ({
    name: s,
    progress: 80,
    level: "Advanced"
  }));\n\n`;
content = content.replace(topSkillsLogic, '');

// Replace the entire Content grid
const gridStartStr = `{/* Content */}`;
const gridStartIndex = content.indexOf(gridStartStr);

// Let's just use string slicing since we know exactly where it is.
// The grid goes all the way down to the closing divs before </PageContainer>.
// I will look for `</PageContainer>`
const pageContainerEndIndex = content.indexOf('</PageContainer>');

// Actually, let's just do a manual string match.
const startTag = `<div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">`;
const endTagStr = `          </div>\n        </div>\n      </div>\n    </PageContainer>`;

if (gridStartIndex !== -1) {
    const preGrid = content.substring(0, gridStartIndex);
    const postGrid = content.substring(content.indexOf(endTagStr));
    const newContent = preGrid + `{/* Content */}\n        <CandidateDashboardContent profile={profile} jobs={jobs || []} candidateData={candidateData} />\n` + postGrid;
    fs.writeFileSync('src/app/(app)/candidate/page.tsx', newContent, 'utf8');
} else {
    console.log("Could not find grid start!");
}

console.log("Updated candidate page with CandidateDashboardContent!");