import fs from 'fs';

let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

// Update imports
content = content.replace(
  'DropdownMenuTrigger \n} from "@/components/ui/dropdown-menu";',
  'DropdownMenuTrigger, \n  DropdownMenuGroup\n} from "@/components/ui/dropdown-menu";'
);

// Update markup
const oldMarkup = `<DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/');
                }} className="text-red-600 focus:text-red-600">Logout</DropdownMenuItem>
              </DropdownMenuContent>`;

const newMarkup = `<DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/');
                  }} className="text-red-600 focus:text-red-600">Logout</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>`;

content = content.replace(oldMarkup, newMarkup);

fs.writeFileSync('src/components/layout/TopNav.tsx', content, 'utf8');
console.log("Fixed MenuGroupContext missing error in TopNav!");