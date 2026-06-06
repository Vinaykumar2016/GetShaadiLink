import https from 'https';

const identifiers = [
  'vintagesense_com_indian_hindi_instrumentals'
];

async function inspectIdentifier(id) {
  return new Promise((resolve) => {
    const url = `https://archive.org/metadata/${id}`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          const mp3s = data.files.filter(f => f.name.endsWith('.mp3'));
          console.log(`\nFiles for ID: ${id}`);
          mp3s.slice(0, 100).forEach(f => {
            console.log(`- File Name: ${f.name} | Size: ${(f.size / (1024 * 1024)).toFixed(2)} MB | Title: ${f.title || 'N/A'}`);
          });
          resolve();
        } catch (err) {
          console.error(`Error parsing files for ${id}:`, err.message);
          resolve();
        }
      });
    }).on('error', (err) => {
      console.error(`Error fetching metadata for ${id}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  for (const id of identifiers) {
    await inspectIdentifier(id);
  }
}

run();
