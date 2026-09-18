$content = Get-Content -Path 'src\app\(app)\job-profiles\page.tsx' -Raw
$content = "use client";

" + $content
$content = $content -replace 'const mockProfiles = \[[\s\S]*?\];\s*// -----------------', ''
$content = $content -replace 'import React from "react";', 'import React from "react";
import { useJobProfiles } from "@/hooks/useJobProfiles";'
$content = $content -replace 'export default function JobProfilesPage\(\) \{', 'export default function JobProfilesPage() {
  const { profiles } = useJobProfiles();'
$content = $content -replace '\{mockProfiles\.map\(\(profile\) => \(', '{profiles.map((profile) => ('
$content = $content -replace 'of \{mockStats\.total\} profiles', 'of {profiles.length} profiles'
$content = $content -replace 'Showing 1 to \{mockProfiles\.length\}', 'Showing 1 to {profiles.length}'

$content = $content -replace '<Button variant="outline".*?Import from URL.*?<\/Button>', ''
$content = $content -replace '<Button className="h-10 bg-teal-500 hover:bg-teal-600 text-white font-medium">', '<Button className="h-10 bg-teal-500 hover:bg-teal-600 text-white font-medium" asChild>
              <Link href="/job-profiles/create">'
$content = $content -replace 'Create Job Profile\s*<\/Button>', 'Create Job Profile
              </Link>
            </Button>'

Set-Content -Path 'src\app\(app)\job-profiles\page.tsx' -Value $content
