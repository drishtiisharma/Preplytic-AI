const fs = require('fs');
let content = fs.readFileSync('src/app/api/report/generate/route.ts', 'utf8');

const target1 = `    // Get auth token from request to pass to backend
    const authHeader = req.headers.get('authorization');
    
    const supabase = await createClient();`;
    
const replacement1 = `    const supabase = await createClient();
    
    // Get auth token from current Supabase session to pass to backend
    const { data: { session: userSession } } = await supabase.auth.getSession();
    const accessToken = userSession?.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }`;

content = content.replace(target1, replacement1);

const target2 = `'Authorization': authHeader || \`Bearer \${process.env.SUPABASE_SERVICE_ROLE_KEY}\` // Fallback for backend auth`;
const replacement2 = `'Authorization': \`Bearer \${accessToken}\``;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/app/api/report/generate/route.ts', content, 'utf8');
console.log("Updated route.ts");