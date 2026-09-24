const fs = require('fs');
const path = 'src/app/api/roadmap/[id]/sync-interview/route.ts';
let content = fs.readFileSync(path, 'utf8');

const oldContextBlock = `    // 3. Extract interview weaknesses, gaps, and topic-level findings
    // 4. Compare them with existing v1 roadmap items
    // 5. Prepare structured context for a future updated roadmap
    const preparedContext = {
      existingRoadmapSummary: roadmap.summary,
      existingItems: currentVersion.roadmap_items.map((item: any) => ({
        title: item.title,
        status: item.status,
        skills: item.skills
      })),
      interviewFindings: {
        overallScore: interviewReport.overall_score,
        weaknesses: interviewReport.weaknesses,
        topicAnalysis: interviewReport.topic_analysis,
        actionableRecommendations: interviewReport.actionable_recommendations
      },
      jobDescription: roadmap.job_profiles?.description || roadmap.job_profiles?.title
    };`;

const newContextBlock = `    // 3. Extract interview weaknesses, gaps, and topic-level findings
    const demonstratedSkills = interviewReport.strengths || [];
    const missingSkills = interviewReport.weaknesses || [];
    
    // 4. Compare them with existing v1 roadmap items to establish baseline progress
    const existingItems = currentVersion.roadmap_items || [];
    const completedItems = existingItems.filter((i: any) => i.status === "completed" || i.progress === 100);
    const incompleteItems = existingItems.filter((i: any) => i.status !== "completed" && i.progress < 100);

    const overallProgress = existingItems.length > 0 
      ? existingItems.reduce((acc: number, item: any) => acc + (item.progress || 0), 0) / existingItems.length / 100 
      : 0;

    // Recalculate available estimated_weeks and hours_per_week deterministically
    const originalWeeks = roadmap.estimated_weeks || 4;
    const recalculatedWeeks = Math.max(1, Math.ceil(originalWeeks * (1 - overallProgress)));
    
    // 5. Prepare deterministic priority data for roadmap generation
    const preparedContext = {
      adaptiveInstructions: {
        newlyMissingSkills: missingSkills,
        alreadyDemonstratedSkills: demonstratedSkills,
        recalculatedEstimatedWeeks: recalculatedWeeks,
        hoursPerWeekTarget: roadmap.hours_per_week || 10,
        completedTopics: completedItems.map((i: any) => i.title),
        carryOverTopics: incompleteItems.map((i: any) => i.title)
      },
      existingRoadmapSummary: roadmap.summary,
      interviewFindings: {
        overallScore: interviewReport.overall_score,
        topicAnalysis: interviewReport.topic_analysis,
        actionableRecommendations: interviewReport.actionable_recommendations
      },
      jobDescription: roadmap.job_profiles?.description || roadmap.job_profiles?.title
    };`;

content = content.replace(oldContextBlock, newContextBlock);

fs.writeFileSync(path, content, 'utf8');
console.log("Injected deterministic adaptive logic.");