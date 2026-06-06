import fs from 'fs';

const content = fs.readFileSync('src/components/InvitationView.tsx', 'utf-8');
const lines = content.split('\n');

const keywords = ["elephant", "thread", "diya", "lotus", "jaipur", "garland"];

keywords.forEach(keyword => {
  console.log(`\n=== Matches for: ${keyword} ===`);
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.includes(`"${keyword}"`) || line.includes(`'${keyword}'`)) {
      if (count < 20) {
        console.log(`${idx + 1}: ${line.trim()}`);
        count++;
      }
    }
  });
});
