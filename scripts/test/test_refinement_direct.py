import json
import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from ai.clients import mistral_client

context = {
    "adaptiveInstructions": {
        "newlyMissingSkills": ["System Design", "Microservices architecture"],
        "alreadyDemonstratedSkills": ["React", "JavaScript", "REST APIs"],
        "recalculatedEstimatedWeeks": 3,
        "hoursPerWeekTarget": 15,
        "completedTopics": ["React Native Fundamentals"],
        "carryOverTopics": ["Backend Node.js API"]
    },
    "existingRoadmapSummary": "Focus on bridging the gap in Fullstack Development.",
    "interviewFindings": {
        "overallScore": 65,
        "topicAnalysis": {
            "job_specific_gaps": ["Lacks experience in event-driven microservices"],
            "concepts_to_improve": ["Event sourcing", "Message queues"]
        },
        "actionableRecommendations": ["Study RabbitMQ", "Review System Design principles"]
    },
    "jobDescription": "Fullstack Developer with strong backend system design skills and modern frontend experience."
}

system_prompt = """You are an expert career and learning coach.
You are given an adaptive context containing an existing learning roadmap, findings from a recent technical interview, and a job description.
Your task is to analyze this data and return a structured JSON response identifying specific modifications to the roadmap.

You MUST return a JSON object with the following structure:
{
    "confirmed_strengths": ["list of skills candidate proved they know"],
    "actual_interview_weaknesses": ["list of areas candidate struggled with in the interview"],
    "concepts_needing_improvement": ["specific technical concepts to review based on interview"],
    "jd_gaps_confirmed_by_interview": ["requirements from JD that candidate lacks based on interview"],
    "roadmap_topics_to_add": ["new learning topics to insert into roadmap"],
    "roadmap_topics_to_remove_or_reduce": ["topics from existing roadmap to skip or reduce because candidate knows them"],
    "priority_changes": ["topics that should be moved up or down in priority"]
}

Do NOT invent any findings. Base your analysis strictly on the provided context."""

analysis_prompt = f"Adaptive Context: {json.dumps(context)}"

try:
    resp = mistral_client.chat.complete(
        model="mistral-small-latest",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": analysis_prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    analysis_data = json.loads(resp.choices[0].message.content.strip())
    print(json.dumps(analysis_data, indent=2))
except Exception as e:
    print(f"Error: {e}")