const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\Lenovo\\Desktop\\Antigravity Projects\\GetShaadiLink\\src\\components\\InvitationView.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log("=== Events rendering in InvitationView.tsx ===");
lines.forEach((line, idx) => {
  if (line.includes('events.map') || line.includes('.events') || line.includes('regional') || line.includes('event.')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
