const fs = require('fs');
let content = fs.readFileSync('src/app/api/report/generate/route.ts', 'utf8');

const targetStr = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Get auth token from request to pass to backend
    const authHeader = req.headers.get('authorization');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );`;

const replacementStr = `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Get auth token from request to pass to backend
    const authHeader = req.headers.get('authorization');
    
    const supabase = await createClient();`;

content = content.replace(targetStr, replacementStr);

fs.writeFileSync('src/app/api/report/generate/route.ts', content, 'utf8');
console.log("Updated report api route!");