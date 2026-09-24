const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/interview/page.tsx.bak', 'utf8');

const badReturn = Buffer.from('Y29uc3QgaGFuZGxlU3RhcnRJbnRlcnZpZXcgPSAoKSA9PiB7DQogICAgY29uc3QgbmV3RXJyb3JzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307DQogICAgaWYgKCFzZWxlY3RlZEpvYklkKSBuZXdFcnJvcnMuam9iID0gIkpvYiBQcm9maWxlIGlzIHJlcXVpcmVkIjsNCiAgICBpZiAoIXNlbGVjdGVkUmVzdW1lSWQpIG5ld0Vycm9ycy5yZXN1bWUgPSAiUmVzdW1lIGlzIHJlcXVpcmVkIjsNCiAgICBpZiAoIXNlbGVjdGVkRHVyYXRpb24pIG5ld0Vycm9ycy5kdXJhdGlvbiA9ICJEdXJhdGlvbiBpcyByZXF1aXJlZCI7DQogICAgaWYgKCFzZWxlY3RlZERpZmZpY3VsdHkpIG5ld0Vycm9ycy5kaWZmaWN1bHR5ID0gIkRpZmZpY3VsdHkgaXMgcmVxdWlyZWQiOw0KICAgIGlmIChzZWxlY3RlZEpvYlRvcGljcy5sZW5ndGggPT09IDAgJiYgc2VsZWN0ZWRSZXN1bWVUb3BpY3MubGVuZ3RoID09PSAwKSB7DQogICAgICBuZXdFcnJvcnMudG9waWNzID0gIkF0IGxlYXN0IG9uZSB0b3BpYyAoSkQgb3IgUmVzdW1lKSBtdXN0IGJlIHNlbGVjdGVkIjsNCiAgICB9DQogICAgc2V0RXJyb3JzKG5ld0Vycm9ycyk7DQogIH07DQoNCiAgcmV0dXJuICg=', 'base64').toString('utf8');

content = content.split(badReturn).join('return (');

// Try with \n instead of \r\n
const badReturn2 = badReturn.replace(/\r\n/g, '\n');
content = content.split(badReturn2).join('return (');

const badSelect = Buffer.from('PC9TZWxlY3RDb250ZW50Pg0KICAgICAgICAgICAgICAgICAgPC9TZWxlY3Q+DQogICAgICAgICAgICAgICAgICB7ZXJyb3JzLmpvYiAmJiA8cCBjbGFzc05hbWU9InRleHQtcmVkLTUwMCB0ZXh0LVsxMXB4XSBmb250LW1lZGl1bSBtdC0xIj57ZXJyb3JzLmpvYn08L3A+fQ0KICAgICAgICAgICAgICAgIDwvZGl2Pg==', 'base64').toString('utf8');
const goodSelect = Buffer.from('PC9TZWxlY3RDb250ZW50Pg0KICAgICAgICAgICAgICAgICAgPC9TZWxlY3Q+DQogICAgICAgICAgICAgICAgPC9kaXY+', 'base64').toString('utf8');

content = content.split(badSelect).join(goodSelect);

const badSelect2 = badSelect.replace(/\r\n/g, '\n');
const goodSelect2 = goodSelect.replace(/\r\n/g, '\n');
content = content.split(badSelect2).join(goodSelect2);

fs.writeFileSync('src/app/(app)/interview/page.tsx', content, 'utf8');
console.log("Reverted file successfully.");