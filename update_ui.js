const fs = require('fs');
const path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetUI = Buffer.from('ICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9InRleHQtWzE1cHhdIGZvbnQtbWVkaXVtIHRleHQtc2xhdGUtODAwIGRhcms6dGV4dC1zbGF0ZS0yMDAgbGVhZGluZy1yZWxheGVkIj4NCiAgICAgICAgICAgICAgICAgICAgICAie2ludGVydmlld1N0YXRlLmN1cnJlbnRRdWVzdGlvbn0iDQogICAgICAgICAgICAgICAgICAgIDwvcD4=', 'base64').toString('utf8');

const replacementUI = Buffer.from('ICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9InRleHQtWzE1cHhdIGZvbnQtbWVkaXVtIHRleHQtc2xhdGUtODAwIGRhcms6dGV4dC1zbGF0ZS0yMDAgbGVhZGluZy1yZWxheGVkIj4NCiAgICAgICAgICAgICAgICAgICAgICB7Y3VycmVudFE/LnF1ZXN0aW9uX3RleHQgfHwgIldhaXRpbmcgZm9yIHF1ZXN0aW9uLi4uIn0NCiAgICAgICAgICAgICAgICAgICAgPC9wPg==', 'base64').toString('utf8');

content = content.replace(targetUI, replacementUI).replace(targetUI.replace(/\r\n/g, '\n'), replacementUI.replace(/\r\n/g, '\n'));
fs.writeFileSync(path, content, 'utf8');
console.log("Updated Question UI display.");