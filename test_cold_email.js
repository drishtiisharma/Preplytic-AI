const fetch = require('node-fetch'); // or just use standard fetch if Node 18+

async function testEndpoint() {
    try {
        const response = await fetch("http://localhost:8000/generate/cold-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer dummy_token"
            },
            body: JSON.stringify({
                job_profile: { title: "Software Engineer" },
                resume_data: { parsed_data: { name: "John Doe" } },
                candidate_profile: { skills: ["Python"] }
            })
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (e) {
        console.log("Fetch error:", e.toString());
    }
}
testEndpoint();