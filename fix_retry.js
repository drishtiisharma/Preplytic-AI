const fs = require('fs');
let content = fs.readFileSync('backend/main.py', 'utf8');

// The replacement logic:
const coldTarget = `    try:
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

const coldReplace = `    try:
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

content = content.replace(coldTarget, coldReplace);

const refTarget = `    try:
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

const refReplace = `    try:
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

content = content.replace(refTarget, refReplace);

fs.writeFileSync('backend/main.py', content, 'utf8');
console.log("Updated main.py!");