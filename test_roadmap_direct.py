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

# The analysis output we got earlier
analysis_data = {
  "confirmed_strengths": ["React", "JavaScript", "REST APIs"],
  "actual_interview_weaknesses": ["System Design", "Microservices architecture", "event-driven microservices"],
  "concepts_needing_improvement": ["Event sourcing", "Message queues"],
  "jd_gaps_confirmed_by_interview": ["backend system design skills", "event-driven microservices"],
  "roadmap_topics_to_add": ["System Design principles", "RabbitMQ", "Microservices architecture", "Event sourcing"],
  "roadmap_topics_to_remove_or_reduce": ["React Native Fundamentals"],
  "priority_changes": ["High priority for System Design and Microservices"]
}

system_prompt_generate = """You are an expert career and learning coach.
Based on the prior analysis, generate the final refined learning roadmap.
The candidate just completed an interview. You MUST adjust the roadmap phases based on the new analysis. Preserve useful topics, but add, remove, or reprioritize based on actual interview evidence.
Return a structured JSON object exactly matching this schema:
{
  "readiness_score": <number 0-100 based on interview performance and remaining gaps>,
  "estimated_weeks": <number>,
  "hours_per_week": <number>,
  "summary": "<brief summary of the refined plan>",
  "focus_skills": ["<skill1>", "<skill2>"],
  "phases": [
    {
      "title": "<phase title>",
      "description": "<what they will learn and why, based on the interview>",
      "week_start": <number>,
      "week_end": <number>,
      "priority": "<high|medium|low>",
      "skills": ["<skill1>", "<skill2>"],
      "resources": []
    }
  ]
}
IMPORTANT: The 'resources' array for each phase MUST be empty []."""

generate_prompt = f"Adaptive Context: {json.dumps(context)}\n\nRefinement Analysis: {json.dumps(analysis_data)}"

try:
    resp = mistral_client.chat.complete(
        model="mistral-small-latest",
        messages=[
            {"role": "system", "content": system_prompt_generate},
            {"role": "user", "content": generate_prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    roadmap_data = json.loads(resp.choices[0].message.content.strip())
    print(json.dumps(roadmap_data, indent=2))
except Exception as e:
    print(f"Error: {e}")