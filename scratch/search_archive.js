import https from 'https';

const queries = ['shehnai dhun', 'shahnai dhun', 'wedding dholak', 'mangala isai'];

async function searchArchive(query) {
  return new Promise((resolve) => {
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=mediatype&rows=60&output=json`;
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

async function run() {
  for (const q of queries) {
    const results = await searchArchive(q);
    if (results && results.length > 0) {
      console.log(`\nResults for "${q}":`);
      results.forEach((doc) => {
        console.log(`- Title: ${doc.title} | Identifier: ${doc.identifier}`);
      });
    }
  }
}

run();
