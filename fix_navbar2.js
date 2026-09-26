const fs = require('fs');
let path = 'src/components/landing/Navbar.tsx';
let content = fs.readFileSync(path, 'utf8');

// I will just append hasDropdown to any object missing it in the mapping if the type is inferred, or find the exact type.
// If it's `const navigation = [` let's just make it `const navigation: {name: string, href: string, hasDropdown?: boolean}[] = [`
content = content.replace(/const navigation = \[/g, 'const navigation: {name: string, href: string, hasDropdown?: boolean}[] = [');

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed Navbar navigation type.");