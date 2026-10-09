import fs from 'fs';
let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

const topnavStateCode = `  const [user, setUser] = useState<any>(null);
  const [avatarDisplayUrl, setAvatarDisplayUrl] = useState<string | null>(null);`;
content = content.replace('  const [user, setUser] = useState<any>(null);', topnavStateCode);

const topnavEffectCode = `  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user?.user_metadata?.avatar_url) {
        if (data.user.user_metadata.avatar_url.startsWith('http')) {
          setAvatarDisplayUrl(data.user.user_metadata.avatar_url);
        } else {
          supabase.storage.from('avatars').createSignedUrl(data.user.user_metadata.avatar_url, 60 * 60 * 24 * 365).then(({ data: signedData }) => {
            if (signedData?.signedUrl) setAvatarDisplayUrl(signedData.signedUrl);
          });
        }
      }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user?.user_metadata?.avatar_url) {
        if (session.user.user_metadata.avatar_url.startsWith('http')) {
          setAvatarDisplayUrl(session.user.user_metadata.avatar_url);
        } else {
          supabase.storage.from('avatars').createSignedUrl(session.user.user_metadata.avatar_url, 60 * 60 * 24 * 365).then(({ data: signedData }) => {
            if (signedData?.signedUrl) setAvatarDisplayUrl(signedData.signedUrl);
          });
        }
      }
    });`;

content = content.replace(/  useEffect\(\(\) => \{\s*supabase\.auth\.getUser\(\)\.then\(\(\{ data \} \) => \{\s*setUser\(data\.user\);\s*\}\);\s*const \{ data: \{ subscription \} \} = supabase\.auth\.onAuthStateChange\(\(_event, session\) => \{\s*setUser\(session\?\.user \|\| null\);\s*\}\);/m, topnavEffectCode);

content = content.replace(/user\?\.user_metadata\?\.avatar_url \?/g, 'avatarDisplayUrl ?');
content = content.replace(/src=\{user\.user_metadata\.avatar_url\}/g, 'src={avatarDisplayUrl}');

fs.writeFileSync('src/components/layout/TopNav.tsx', content, 'utf8');
console.log("Updated TopNav for private signed URLs!");