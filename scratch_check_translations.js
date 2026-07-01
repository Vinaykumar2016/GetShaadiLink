const fs = require('fs');
const path = require('path');

const dirPath = 'c:\\Users\\Lenovo\\Desktop\\Antigravity Projects\\GetShaadiLink\\data\\invitations';
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    console.log(`\nFile: ${file} | Lang: ${data.lang} | Title: ${data.bride} & ${data.groom}`);
    if (data.events) {
      data.events.forEach((ev, i) => {
        console.log(`  Event ${i+1}: Name="${ev.name}" | Regional="${ev.regional}"`);
      });
    } else {
      console.log('  No events array!');
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});
