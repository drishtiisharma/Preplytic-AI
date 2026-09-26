const fs = require('fs');
let path = 'src/app/(app)/roadmap/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add Refine button in the selection area next to Generate button
const generateBtn = `            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !selectedJobId || !selectedResumeId}
              className="h-12 px-8 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold w-full lg:w-auto"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
              {isGenerating ? "Generating Roadmap..." : roadmap ? "Re-Generate Roadmap" : "Generate Roadmap"}
            </Button>`;

const refineBtn = `
            {roadmap && hasInterview && (
              <Button 
                onClick={handleRefine} 
                disabled={isRefining}
                className="h-12 px-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold w-full lg:w-auto"
              >
                {isRefining ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isRefining ? "Refining..." : "Refine with Interview"}
              </Button>
            )}
`;
if (!content.includes('onClick={handleRefine}')) {
    content = content.replace(generateBtn, generateBtn + refineBtn);
}

// Add 'is_refined' to type Roadmap
content = content.replace(
    'roadmap_versions: { roadmap_items: RoadmapItem[] }[]; };',
    'roadmap_versions: { roadmap_items: RoadmapItem[] }[]; is_refined?: boolean; };'
);

// Display "Refined" badge in the title
const titleArea = `<h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Preparation Roadmap</h1>`;
const newTitleArea = `<h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              Preparation Roadmap
              {roadmap?.is_refined && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Interview Refined
                </span>
              )}
            </h1>`;
if (!content.includes('Interview Refined')) {
    content = content.replace(titleArea, newTitleArea);
}

// Add loading state for refining
const genLoading = `{isGenerating && (
          <div className="text-center py-20 text-slate-500 animate-pulse">
            <RefreshCw className="w-10 h-10 animate-spin mx-auto text-teal-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI is crafting your roadmap...</h3>
            <p>Analyzing job requirements and identifying skill gaps.</p>
          </div>
        )}`;

const refineLoading = `
        {isRefining && (
          <div className="text-center py-20 text-indigo-500 animate-pulse">
            <Sparkles className="w-10 h-10 animate-pulse mx-auto text-indigo-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Refining Roadmap...</h3>
            <p className="text-slate-500">Injecting your technical interview performance insights.</p>
          </div>
        )}
`;
if (!content.includes('Refining Roadmap...')) {
    content = content.replace(genLoading, genLoading + refineLoading);
}

// Ensure the roadmap doesn't show while refining
content = content.replace('{roadmap && !isGenerating && (', '{roadmap && !isGenerating && !isRefining && (');

fs.writeFileSync(path, content, 'utf8');
console.log("Updated UI rendering in roadmap page");