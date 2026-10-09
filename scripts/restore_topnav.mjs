import fs from 'fs';

let content = fs.readFileSync('src/components/layout/TopNav.tsx', 'utf8');

const navLinksCode = `
const navLinks = [
  { name: "Features", href: "/#features" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
  { name: "FAQ", href: "/#faq" },
  { name: "Contact Us", href: "/#contact" },
];
`;

content = content.replace('export function TopNav', navLinksCode + '\nexport function TopNav');

const desktopNavCode = `
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 flex items-center gap-1"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
`;

content = content.replace(
  '<Link href="/" className="flex items-center gap-2">\n              <div className="relative h-10 w-40 shrink-0">\n                <img src="/logo.png" alt="Preplytic AI" className="h-full w-full object-contain object-left dark:brightness-200 dark:contrast-100" />\n              </div>\n            </Link>\n\n            \n          </div>',
  '<Link href="/" className="flex items-center gap-2">\n              <div className="relative h-10 w-40 shrink-0">\n                <img src="/logo.png" alt="Preplytic AI" className="h-full w-full object-contain object-left dark:brightness-200 dark:contrast-100" />\n              </div>\n            </Link>\n\n' + desktopNavCode + '\n          </div>'
);

const mobileNavCode = `
                  <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        {link.name}
                      </Link>
                    ))}
                    <Link href="/#faq" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 mt-2 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Help
                    </Link>
                  </nav>
`;

content = content.replace(
  '<img src="/logo.png" alt="Preplytic AI" className="h-full w-full object-contain object-left dark:brightness-200 dark:contrast-100" />\n                    </div>\n                  </Link>\n                  \n                </div>',
  '<img src="/logo.png" alt="Preplytic AI" className="h-full w-full object-contain object-left dark:brightness-200 dark:contrast-100" />\n                    </div>\n                  </Link>\n' + mobileNavCode + '\n                </div>'
);

fs.writeFileSync('src/components/layout/TopNav.tsx', content, 'utf8');
console.log("Restored nav links in TopNav!");