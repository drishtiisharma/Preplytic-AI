import os
import sys
import traceback

sys.path.append(os.path.join(os.getcwd(), 'backend'))

from ai.clients import groq_client
from ai.config import AIConfig

try:
    print(f"Testing Groq with model: {AIConfig.GROQ_TEXT_MODEL}")
    response = groq_client.chat.completions.create(
        model=AIConfig.GROQ_TEXT_MODEL,
        messages=[{"role": "user", "content": "Test prompt"}],
        temperature=0.3,
        response_format={"type": "json_object"}
    )
    print("Success!")
except Exception as e:
    print("Exception caught:")
    traceback.print_exc()