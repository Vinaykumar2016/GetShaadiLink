import https from 'https';

const searchTerms = [
  'hindi instrumental romantic',
  'bollywood instrumental love',
  'hindi love songs instrumental',
  'bollywood instrumentals',
  'romantic instrumental flute piano'
];

async function searchArchive(query) {
  return new Promise((resolve) => {
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}+AND+mediatype:audio&fl[]=identifier&fl[]=title&rows=10&output=json`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data.response.docs);
        } catch (err) {
          resolve([]);
        }
      });
    }).on('error', (err) => {
      resolve([]);
    });
  });
}

async function getFiles(id) {
  return new Promise((resolve) => {
    const url = `https://archive.org/metadata/${id}`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          const mp3s = data.files.filter(f => f.name.endsWith('.mp3'));
          resolve(mp3s);
        } catch (err) {
          resolve([]);
        }
      });
    }).on('error', (err) => {
      resolve([]);
    });
  });
}

async function run() {
  for (const term of searchTerms) {
    const docs = await searchArchive(term);
    if (docs && docs.length > 0) {
      console.log(`\n=== Results for term: "${term}" ===`);
      for (const doc of docs) {
        const mp3s = await getFiles(doc.identifier);
        if (mp3s && mp3s.length > 0) {
          console.log(`Identifier: ${doc.identifier} | Title: ${doc.title}`);
          mp3s.slice(0, 10).forEach(f => {
            console.log(`  - File: ${f.name} | Title: ${f.title || 'N/A'} | Size: ${(f.size / (1024*1024)).toFixed(2)} MB`);
          });
        }
      }
    }
  }
}

run();
