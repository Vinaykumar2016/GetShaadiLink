import https from 'https';

https.get('https://archive.org/download/lp_classical-music-of-india_various/disc1/', (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const regex = /href="([^"]+)"/g;
    let match;
    const links = [];
    while ((match = regex.exec(body)) !== null) {
      links.push(match[1]);
    }
    console.log('All audio links in disc1:', links.filter(l => !l.startsWith('/') && !l.startsWith('http') && !l.startsWith('#')));
  });
}).on('error', (err) => {
  console.error(err);
});
