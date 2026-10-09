import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/settings/page.tsx', 'utf8');

const oldUrlLogic = `    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    });`;

const newUrlLogic = `    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const finalUrl = \`\${publicUrl}?v=\${Date.now()}\`;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: finalUrl }
    });`;

content = content.replace(oldUrlLogic, newUrlLogic);
fs.writeFileSync('src/app/(app)/settings/page.tsx', content, 'utf8');
console.log("Fixed avatar caching issue!");