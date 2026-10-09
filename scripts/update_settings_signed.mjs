import fs from 'fs';
let content = fs.readFileSync('src/app/(app)/settings/page.tsx', 'utf8');

const stateCode = `  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarDisplayUrl, setAvatarDisplayUrl] = useState<string | null>(null);`;
content = content.replace('  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);', stateCode);

const effectCode = `        setAvatarUrl(user.user_metadata?.avatar_url || null);
        if (user.user_metadata?.avatar_url) {
          if (user.user_metadata.avatar_url.startsWith('http')) {
            setAvatarDisplayUrl(user.user_metadata.avatar_url);
          } else {
            supabase.storage.from('avatars').createSignedUrl(user.user_metadata.avatar_url, 60 * 60 * 24 * 365).then(({ data }) => {
              if (data?.signedUrl) setAvatarDisplayUrl(data.signedUrl + \`&v=\${Date.now()}\`);
            });
          }
        }`;
content = content.replace('        setAvatarUrl(user.user_metadata?.avatar_url || null);', effectCode);

const uploadLogicOld = `    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const finalUrl = \`\${publicUrl}?v=\${Date.now()}\`;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: finalUrl }
    });

    if (updateError) {
      showMessage("error", "Failed to update profile: " + updateError.message);
    } else {
      setAvatarUrl(finalUrl);
      showMessage("success", "Profile picture updated.");
    }`;

const uploadLogicNew = `    // Store the path, not public URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: filePath }
    });

    if (updateError) {
      showMessage("error", "Failed to update profile: " + updateError.message);
    } else {
      setAvatarUrl(filePath);
      // Generate signed url for immediate display
      const { data } = await supabase.storage.from('avatars').createSignedUrl(filePath, 60 * 60 * 24 * 365);
      if (data?.signedUrl) {
        setAvatarDisplayUrl(data.signedUrl + \`&v=\${Date.now()}\`);
      }
      showMessage("success", "Profile picture updated.");
    }`;

content = content.replace(uploadLogicOld, uploadLogicNew);

// Now replace img src={avatarUrl} with avatarDisplayUrl
content = content.replace(/avatarUrl \?/g, 'avatarDisplayUrl ?');
content = content.replace(/src=\{avatarUrl\}/g, 'src={avatarDisplayUrl}');

fs.writeFileSync('src/app/(app)/settings/page.tsx', content, 'utf8');
console.log("Updated settings page for private signed URLs!");