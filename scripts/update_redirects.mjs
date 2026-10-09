import fs from 'fs';

// 1. Sidebar.tsx
let sidebar = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace(
  '{ name: "Dashboard", href: "/dashboard", icon: LayoutGrid },',
  '// { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },'
);
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebar, 'utf8');

// 2. login/page.tsx
let login = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');
login = login.replace(/router\.push\("\/dashboard"\)/g, 'router.push("/candidate")');
fs.writeFileSync('src/app/(auth)/login/page.tsx', login, 'utf8');

// 3. signup/page.tsx
let signup = fs.readFileSync('src/app/(auth)/signup/page.tsx', 'utf8');
signup = signup.replace(/router\.push\("\/dashboard"\)/g, 'router.push("/candidate")');
fs.writeFileSync('src/app/(auth)/signup/page.tsx', signup, 'utf8');

// 4. auth/callback/route.ts
let callback = fs.readFileSync('src/app/auth/callback/route.ts', 'utf8');
callback = callback.replace(/NextResponse\.redirect\(\`\$\{origin\}\/dashboard\`\)/g, 'NextResponse.redirect(`${origin}/candidate`)');
fs.writeFileSync('src/app/auth/callback/route.ts', callback, 'utf8');

// 5. middleware.ts
let middleware = fs.readFileSync('src/lib/supabase/middleware.ts', 'utf8');
middleware = middleware.replace(
  'const url = request.nextUrl.clone()\n      url.pathname = \'/dashboard\'\n      return NextResponse.redirect(url)',
  'const url = request.nextUrl.clone()\n      url.pathname = \'/candidate\'\n      return NextResponse.redirect(url)'
);
fs.writeFileSync('src/lib/supabase/middleware.ts', middleware, 'utf8');

// 6. interview/[sessionId]/report/page.tsx
let report = fs.readFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', 'utf8');
report = report.replace(/href="\/dashboard"/g, 'href="/candidate"');
fs.writeFileSync('src/app/(app)/interview/[sessionId]/report/page.tsx', report, 'utf8');

console.log("Updated all dashboard redirects to candidate!");