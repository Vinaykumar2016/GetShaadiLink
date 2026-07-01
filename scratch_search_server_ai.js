const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Lenovo\\Desktop\\Antigravity Projects\\GetShaadiLink\\server.ts';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== AI call check in server.ts ===");
lines.forEach((line, idx) => {
  if (line.includes('generateContent') || line.includes('/api/invitations') || line.includes('models.generateContent')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
