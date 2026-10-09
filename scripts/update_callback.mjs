import fs from 'fs';

// callback
let callback = fs.readFileSync('src/app/auth/callback/route.ts', 'utf8');
callback = callback.replace(/const next = searchParams.get\('next'\) \?\? '\/dashboard'/g, "const next = searchParams.get('next') ?? '/candidate'");
fs.writeFileSync('src/app/auth/callback/route.ts', callback, 'utf8');

// middleware
let middleware = fs.readFileSync('src/lib/supabase/middleware.ts', 'utf8');
middleware = middleware.replace(/url\.pathname = '\/dashboard'/g, "url.pathname = '/candidate'");
fs.writeFileSync('src/lib/supabase/middleware.ts', middleware, 'utf8');

console.log("Updated callback and middleware!");