import re
from io import BytesIO
from typing import Dict, Any, List
from pypdf import PdfReader

# Predefined dictionary of technical and professional skills
KNOWN_SKILLS = {
    "python", "javascript", "typescript", "java", "c++", "c#", "ruby", "go", "rust", "php",
    "html", "css", "react", "angular", "vue", "next.js", "node.js", "express", "django",
    "flask", "spring", "sql", "mysql", "postgresql", "mongodb", "redis", "docker",
    "kubernetes", "aws", "azure", "gcp", "git", "linux", "machine learning",
    "data science", "agile", "scrum", "project management", "communication",
    "leadership", "fastapi", "pandas", "numpy", "tensorflow", "pytorch", "tailwind"
}

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text

def parse_email(text: str) -> str | None:
    match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match.group(0) if match else None

def parse_phone(text: str) -> str | None:
    # Matches common phone formats: (123) 456-7890, 123-456-7890, +1 123 456 7890
    match = re.search(r"(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}", text)
    return match.group(0) if match else None

def parse_linkedin(text: str) -> str | None:
    match = re.search(r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+", text)
    return match.group(0) if match else None

def extract_skills(text: str) -> List[str]:
    text_lower = text.lower()
    # Simple tokenization by non-alphanumeric characters (excluding + and # for C++, C#)
    tokens = re.split(r'[^\w+#.]+', text_lower)
    found_skills = set()
    
    # Check individual words
    for token in tokens:
        if token in KNOWN_SKILLS:
            found_skills.add(token)
            
    # Check multi-word skills
    for skill in KNOWN_SKILLS:
        if " " in skill and skill in text_lower:
            found_skills.add(skill)
            
    # Return formatted skills
    # Simple capitalization strategy for the dictionary
    capitalized_skills = []
    for s in list(found_skills):
        if s == "javascript": capitalized_skills.append("JavaScript")
        elif s == "typescript": capitalized_skills.append("TypeScript")
        elif s == "react": capitalized_skills.append("React")
        elif s == "node.js": capitalized_skills.append("Node.js")
        elif s == "next.js": capitalized_skills.append("Next.js")
        elif s == "fastapi": capitalized_skills.append("FastAPI")
        elif s == "aws": capitalized_skills.append("AWS")
        elif s == "gcp": capitalized_skills.append("GCP")
        elif s == "sql": capitalized_skills.append("SQL")
        elif s == "postgresql": capitalized_skills.append("PostgreSQL")
        elif s == "mysql": capitalized_skills.append("MySQL")
        elif s == "mongodb": capitalized_skills.append("MongoDB")
        elif s == "css": capitalized_skills.append("CSS")
        elif s == "html": capitalized_skills.append("HTML")
        elif s == "php": capitalized_skills.append("PHP")
        else: capitalized_skills.append(s.title())
        
    return capitalized_skills

def extract_name(text: str) -> str | None:
    # A very basic heuristic: First non-empty line is usually the name
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        # If the first line contains an email or phone, it's probably not just a name.
        first_line = lines[0]
        if "@" not in first_line and not re.search(r"\d{3}", first_line):
            return first_line
    return None

def parse_resume(pdf_bytes: bytes) -> Dict[str, Any]:
    text = extract_text_from_pdf(pdf_bytes)
    
    if not text:
        return {}

    # Basic structured extraction
    email = parse_email(text)
    phone = parse_phone(text)
    linkedin = parse_linkedin(text)
    skills = extract_skills(text)
    name = extract_name(text)

    # For this milestone, we use regex/dictionary for simple fields.
    # Advanced sectioning (experience, education) requires NLP or LLM, 
    # but we can return empty arrays for now as requested by "Do not invent missing info".
    # A deterministic parser without NLP is severely limited for complex structures like experience.

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "location": None,  # Hard to deterministically parse without NLP/Geo-dict
        "linkedin_url": linkedin,
        "summary": None,   # Hard to bound deterministically
        "current_role": None,
        "skills": skills,
        "experience": [],
        "education": [],
        "certifications": [],
        "preferences": {},
        "activity": []
    }