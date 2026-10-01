const fs = require('fs');

const content = `import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json({ error: "No text provided for TTS." }, { status: 400 });
    }
    
    // Proxy the request to the Python FastAPI backend
    const backendResponse = await fetch('http://localhost:8000/generate/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!backendResponse.ok) {
      const errText = await backendResponse.text();
      console.error("Backend TTS Error:", errText);
      return NextResponse.json(
        { error: \`Backend TTS generation failed: \${backendResponse.statusText}\` }, 
        { status: backendResponse.status }
      );
    }

    // Stream the binary audio blob back to the frontend client
    const audioBlob = await backendResponse.blob();
    
    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'attachment; filename="speech.wav"'
      }
    });
    
  } catch (error: any) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process TTS" }, { status: 500 });
  }
}
`;

fs.writeFileSync('src/app/api/tts/route.ts', content, 'utf8');
console.log("Updated TTS route as proxy!");