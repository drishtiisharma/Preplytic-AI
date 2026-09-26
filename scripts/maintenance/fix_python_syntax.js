const fs = require('fs');
let path = 'backend/main.py';
let content = fs.readFileSync(path, 'utf8');

// Fix the newline in generate_prompt
content = content.replace(
    /generate_prompt = f"Adaptive Context: \{json\.dumps\(req\.preparedContext\)\}\n\nRefinement Analysis: \{json\.dumps\(analysis_data\)\}"/g,
    'generate_prompt = f"Adaptive Context: {json.dumps(req.preparedContext)}\\n\\nRefinement Analysis: {json.dumps(analysis_data)}"'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed python syntax error");