const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

const oldPydantic = `class RoadmapRequest(BaseModel):
    job_profile: dict
    candidate_profile: dict
    resume_record: dict`;

const newPydantic = `class RoadmapRequest(BaseModel):
    job_profile: dict
    candidate_profile: dict
    resume_record: dict
    interview_report: dict = None`;

content = content.replace(oldPydantic, newPydantic);

// Add interview data to clean_roadmap_context
const oldContext = `    # Create one clean internal input object for future Mistral roadmap generation
    clean_roadmap_context = {
        "target_role": job_title,
        "job_requirements": job_description,
        "candidate_skills": candidate_skills,
        "candidate_experience": candidate_experience,
        "additional_context": "Initial roadmap generation without prior interview gaps."
    }`;

const newContext = `    # Prepare interview gaps if present
    interview_gaps = []
    interview_strengths = []
    if req.interview_report:
        topic_analysis = req.interview_report.get("topic_analysis", {})
        if isinstance(topic_analysis, dict):
            interview_gaps = topic_analysis.get("job_specific_gaps", []) + topic_analysis.get("concepts_to_improve", [])
        interview_strengths = req.interview_report.get("strengths", [])

    # Create one clean internal input object for future Mistral roadmap generation
    clean_roadmap_context = {
        "target_role": job_title,
        "job_requirements": job_description,
        "candidate_skills": candidate_skills,
        "candidate_experience": candidate_experience,
        "interview_identified_gaps": interview_gaps,
        "interview_strengths": interview_strengths,
        "additional_context": "Initial roadmap generation without prior interview gaps." if not interview_gaps else "Refining roadmap based on recent interview performance gaps."
    }`;

content = content.replace(oldContext, newContext);
fs.writeFileSync(path, content, 'utf8');
console.log("Updated main.py to accept interview_report");