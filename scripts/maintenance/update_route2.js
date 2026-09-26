const fs = require('fs');
let content = fs.readFileSync('src/app/api/roadmap/generate/route.ts', 'utf8');

const validationLogic = `
    if (itemsError) throw itemsError;

    // 8. Verify the insert succeeded by explicitly querying roadmap_items
    const { count: itemsCount, error: countError } = await supabase
      .from("roadmap_items")
      .select("*", { count: "exact", head: true })
      .eq("roadmap_version_id", versionInsert.id);
      
    if (countError) throw countError;
    if (itemsCount === null || itemsCount === 0) {
      throw new Error(\`Failed to save roadmap items. Expected \${itemsToInsert.length} but found 0 in database.\`);
    }
`;

content = content.replace(
    /if \(itemsError\) throw itemsError;/,
    validationLogic.trim()
);

fs.writeFileSync('src/app/api/roadmap/generate/route.ts', content, 'utf8');
console.log("Updated route.ts with final DB verification logic.");