const fs = require('fs');
const path = 'src/app/(app)/interview/[sessionId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add isCompleting state
const stateTarget = Buffer.from('ICBjb25zdCBbc3VibWl0RXJyb3IsIHNldFN1Ym1pdEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZz4oIiIpOw==', 'base64').toString('utf8');
const stateRep = Buffer.from('ICBjb25zdCBbc3VibWl0RXJyb3IsIHNldFN1Ym1pdEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZz4oIiIpOw0KICBjb25zdCBbaXNDb21wbGV0aW5nLCBzZXRJc0NvbXBsZXRpbmddID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpOw==', 'base64').toString('utf8');
content = content.replace(stateTarget, stateRep).replace(stateTarget.replace(/\r\n/g, '\n'), stateRep.replace(/\r\n/g, '\n'));

// 2. Add completeInterview function before handleAnswerSubmit
const funcTarget = Buffer.from('ICBjb25zdCBoYW5kbGVBbnN3ZXJTdWJtaXQgPSBhc3luYyAoKSA9PiB7', 'base64').toString('utf8');
const funcRep = Buffer.from('ICBjb25zdCBjb21wbGV0ZUludGVydmlldyA9IGFzeW5jICgpID0+IHsNCiAgICBzZXRJc0NvbXBsZXRpbmcodHJ1ZSk7DQogICAgc2V0U3VibWl0RXJyb3IoIiIpOw0KICAgIA0KICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlDQogICAgICAuZnJvbSgnaW50ZXJ2aWV3X3Nlc3Npb25zJykNCiAgICAgIC51cGRhdGUoew0KICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLA0KICAgICAgICBjb21wbGV0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKQ0KICAgICAgfSkNCiAgICAgIC5lcSgnaWQnLCBzZXNzaW9uSWQpOw0KICAgICAgDQogICAgaWYgKGVycm9yKSB7DQogICAgICBjb25zb2xlLmVycm9yKGVycm9yKTsNCiAgICAgIHNldFN1Ym1pdEVycm9yKCJGYWlsZWQgdG8gY29tcGxldGUgaW50ZXJ2aWV3LiIpOw0KICAgICAgc2V0SXNDb21wbGV0aW5nKGZhbHNlKTsNCiAgICB9IGVsc2Ugew0KICAgICAgcm91dGVyLnB1c2goYC9pbnRlcnZpZXcvJHtzZXNzaW9uSWR9L3JlcG9ydGApOw0KICAgIH0NCiAgfTsNCg0KICBjb25zdCBoYW5kbGVBbnN3ZXJTdWJtaXQgPSBhc3luYyAoKSA9PiB7', 'base64').toString('utf8');
content = content.replace(funcTarget, funcRep).replace(funcTarget.replace(/\r\n/g, '\n'), funcRep.replace(/\r\n/g, '\n'));

// 3. Update handleAnswerSubmit logic to call completeInterview
const submitTarget = Buffer.from('ICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbkluZGV4IDwgcXVlc3Rpb25zLmxlbmd0aCAtIDEpIHsNCiAgICAgICAgc2V0Q3VycmVudFF1ZXN0aW9uSW5kZXgocHJldiA9PiBwcmV2ICsgMSk7DQogICAgICB9DQogICAgfQ0KICAgIHNldElzU3VibWl0dGluZyhmYWxzZSk7', 'base64').toString('utf8');
const submitRep = Buffer.from('ICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbkluZGV4IDwgcXVlc3Rpb25zLmxlbmd0aCAtIDEpIHsNCiAgICAgICAgc2V0Q3VycmVudFF1ZXN0aW9uSW5kZXgocHJldiA9PiBwcmV2ICsgMSk7DQogICAgICAgIHNldElzU3VibWl0dGluZyhmYWxzZSk7DQogICAgICB9IGVsc2Ugew0KICAgICAgICBhd2FpdCBjb21wbGV0ZUludGVydmlldygpOw0KICAgICAgfQ0KICAgIH0gZWxzZSB7DQogICAgICBzZXRJc1N1Ym1pdHRpbmcoZmFsc2UpOw0KICAgIH0=', 'base64').toString('utf8');
content = content.replace(submitTarget, submitRep).replace(submitTarget.replace(/\r\n/g, '\n'), submitRep.replace(/\r\n/g, '\n'));

// 4. Also map the End Call button to completeInterview and handle isCompleting UI
const endCallTarget = Buffer.from('ICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9ImRlc3RydWN0aXZlIiBjbGFzc05hbWU9ImgtMTQgcHgtOCByb3VuZGVkLTJ4bCBmb250LWJvbGQgc2hhZG93LW1kIHNoYWRvdy1yZWQtNTAwLzIwIj4NCiAgICAgICAgICAgICAgICAgICAgICA8UGhvbmVPZmYgY2xhc3NOYW1lPSJ3LTUgaC01IG1yLTIiIC8+DQogICAgICAgICAgICAgICAgICAgICAgRW5kIENhbGwNCiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+', 'base64').toString('utf8');
const endCallRep = Buffer.from('ICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIA0KICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9ImRlc3RydWN0aXZlIiANCiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9ImgtMTQgcHgtOCByb3VuZGVkLTJ4bCBmb250LWJvbGQgc2hhZG93LW1kIHNoYWRvdy1yZWQtNTAwLzIwIiANCiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtjb21wbGV0ZUludGVydmlld30NCiAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNDb21wbGV0aW5nfQ0KICAgICAgICAgICAgICAgICAgICA+DQogICAgICAgICAgICAgICAgICAgICAgPFBob25lT2ZmIGNsYXNzTmFtZT0idy01IGgtNSBtci0yIiAvPg0KICAgICAgICAgICAgICAgICAgICAgIHtpc0NvbXBsZXRpbmcgPyAiRW5kaW5nLi4uIiA6ICJFbmQgQ2FsbCJ9DQogICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPg==', 'base64').toString('utf8');
content = content.replace(endCallTarget, endCallRep).replace(endCallTarget.replace(/\r\n/g, '\n'), endCallRep.replace(/\r\n/g, '\n'));

fs.writeFileSync(path, content, 'utf8');
console.log("Updated completion workflow.");