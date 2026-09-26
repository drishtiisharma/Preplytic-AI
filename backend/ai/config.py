import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class AIConfig:
    # Gemini
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_TEXT_MODEL = os.getenv("GEMINI_TEXT_MODEL", "gemini-3.8-flash")
    GEMINI_TTS_MODEL = os.getenv("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
    
    # Groq
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_TEXT_MODEL = os.getenv("GROQ_TEXT_MODEL", "openai/gpt-oss-120b")
    GROQ_STT_MODEL = os.getenv("GROQ_STT_MODEL", "whisper-large-v3-turbo")
    GROQ_ROADMAP_API_KEY = os.getenv("GROQ_ROADMAP_API_KEY")
    GROQ_ROADMAP_MODEL = os.getenv("GROQ_ROADMAP_MODEL", "openai/gpt-oss-120b")
    
    # Mistral
    MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
    
    # Tavily
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    
    # Embeddings
    EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "sentence-transformers")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "Qwen/Qwen3-Embedding-0.6B")
