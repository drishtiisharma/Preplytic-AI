from .config import AIConfig

# Initialize Gemini
import google.genai as genai
if AIConfig.GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=AIConfig.GEMINI_API_KEY)
else:
    gemini_client = None

# Initialize Groq
from groq import Groq
if AIConfig.GROQ_API_KEY:
    groq_client = Groq(api_key=AIConfig.GROQ_API_KEY)
else:
    groq_client = None

# Initialize Mistral
from mistralai.client import Mistral
if AIConfig.MISTRAL_API_KEY:
    mistral_client = Mistral(api_key=AIConfig.MISTRAL_API_KEY)
else:
    mistral_client = None

# Initialize Tavily
from tavily import TavilyClient
if AIConfig.TAVILY_API_KEY:
    tavily_client = TavilyClient(api_key=AIConfig.TAVILY_API_KEY)
else:
    tavily_client = None

# Initialize Sentence Transformers locally
embedding_model = None
if AIConfig.EMBEDDING_PROVIDER == "sentence-transformers":
    try:
        from sentence_transformers import SentenceTransformer
        # This will automatically download and cache the model on first run
        embedding_model = SentenceTransformer(AIConfig.EMBEDDING_MODEL)
    except Exception as e:
        print(f"Error loading embedding model: {e}")
