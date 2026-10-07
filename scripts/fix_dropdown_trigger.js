const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/roadmap/page.tsx', 'utf8');

// Undo the asChild
content = content.replace(/<DropdownMenuTrigger asChild>/g, '<DropdownMenuTrigger>');

// Replace the nested Button with a styled div
const oldButton = `<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                                          <ChevronDown className="w-5 h-5" />
                                        </Button>`;
const newDiv = `<div className="flex items-center justify-center h-8 w-8 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer">
                                          <ChevronDown className="w-5 h-5" />
                                        </div>`;

content = content.replace(oldButton, newDiv);

fs.writeFileSync('src/app/(app)/roadmap/page.tsx', content, 'utf8');
console.log("Fixed DropdownMenuTrigger nested button with a div!");