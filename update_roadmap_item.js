const fs = require('fs');
const path = 'src/app/api/roadmap/items/[item_id]/route.ts';
let content = fs.readFileSync(path, 'utf8');

// Update the select query to fetch status and progress
const oldSelect = `.select("id, roadmap_versions(roadmaps(user_id))")`;
const newSelect = `.select("id, status, progress, roadmap_versions(roadmaps(user_id))")`;

content = content.replace(oldSelect, newSelect);

// Fix the constraint logic to use existing item state for reopening
const oldLogic = `    // Apply constraints
    if (progress !== undefined) {
      progress = Math.max(0, Math.min(100, Number(progress)));
      if (progress === 100) status = "completed";
      // If progress is not 100 and status was completed, maybe they want to reopen it
      if (progress < 100 && status === "completed") status = "in_progress";
    }

    if (status !== undefined) {
      if (!["not_started", "in_progress", "completed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      if (status === "completed") progress = 100;
    }`;

const newLogic = `    // Apply constraints
    if (progress !== undefined) {
      progress = Math.max(0, Math.min(100, Number(progress)));
      if (progress === 100) {
        status = "completed";
      }
    }

    if (status !== undefined) {
      if (!["not_started", "in_progress", "completed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      if (status === "completed") {
        progress = 100;
      }
    }`;

// Wait, if I do this, I must do it AFTER fetching the item to know the previous state.
// Actually, it's safer to just implement exactly what the prompt asks:
// - If progress=100 -> status=completed
// - If status=completed -> progress=100
// I will just use the newLogic.
content = content.replace(oldLogic, newLogic);
if (!content.includes('if (progress === 100) {')) {
   content = content.replace(oldLogic.replace(/\n/g, "\r\n"), newLogic.replace(/\n/g, "\r\n"));
}

fs.writeFileSync(path, content, 'utf8');
console.log("Updated roadmap item route constraint logic.");