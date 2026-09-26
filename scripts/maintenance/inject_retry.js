const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

// Inject asyncio if needed
if (!content.includes('import asyncio')) {
    content = content.replace('import os\n', 'import os\nimport asyncio\n');
}

// Inject the helper function
const retryFunc = `
async def _generate_with_retry(prompt: str):
    for attempt in range(3):
        try:
            return gemini_client.models.generate_content(
                model=AIConfig.GEMINI_TEXT_MODEL,
                contents=prompt,
            )
        except Exception as e:
            if "503" in str(e) or "UNAVAILABLE" in str(e):
                if attempt < 2:
                    await asyncio.sleep(2)
                    continue
                raise HTTPException(status_code=503, detail="Gemini is temporarily unavailable. Please try again.")
            raise e

@app.post("/generate/cold-email")`;

content = content.replace('@app.post("/generate/cold-email")', retryFunc);

// Update Cold Email try/except block
const coldTryBlock = `    try:
        response = gemini_client.models.generate_content(
            model=AIConfig.GEMINI_TEXT_MODEL,
            contents=prompt,
        )
        return {
            "id": str(uuid.uuid4()),
            "message_type": "cold_mail",
            "content": response.text.strip()
        }
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate cold email")`;

const coldReplaceBlock = `    try:
        response = await _generate_with_retry(prompt)
        return {
            "id": str(uuid.uuid4()),
            "message_type": "cold_mail",
            "content": response.text.strip()
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate cold email")`;

content = content.replace(coldTryBlock, coldReplaceBlock);

// Update Referral try/except block
const refTryBlock = `    try:
        response = gemini_client.models.generate_content(
            model=AIConfig.GEMINI_TEXT_MODEL,
            contents=prompt,
        )
        return {
            "id": str(uuid.uuid4()),
            "message_type": "referral_message",
            "content": response.text.strip()
        }
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate referral message")`;

const refReplaceBlock = `    try:
        response = await _generate_with_retry(prompt)
        return {
            "id": str(uuid.uuid4()),
            "message_type": "referral_message",
            "content": response.text.strip()
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Generation error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate referral message")`;

content = content.replace(refTryBlock, refReplaceBlock);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated main.py successfully.");