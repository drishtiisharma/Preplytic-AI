import requests
import json

# Dummy context representing a completed interview + roadmap
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

try:
    resp = requests.post(
        "http://localhost:8000/generate/roadmap-refinement-analysis",
        json={"preparedContext": context}
    )
    print(json.dumps(resp.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")