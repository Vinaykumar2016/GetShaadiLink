import https from 'https';
import fs from 'fs';
import path from 'path';

const downloads = [
  {
    url: 'https://archive.org/download/lp_classical-music-of-india_various/disc1/02.03.%20Naubat%20Shana%27I.mp3',
    dest: 'public/samples/melody.mp3'
  },
  {
    url: 'https://archive.org/download/lp_classical-music-of-india_various/disc1/01.01.%20Bansri.mp3',
    dest: 'public/samples/lofi_kriya.mp3'
  },
  {
    url: 'https://archive.org/download/lp_classical-music-of-india_various/disc1/02.01.%20Rudra%20Vina.mp3',
    dest: 'public/samples/lofi_breeze.mp3'
  },
  {
    url: 'https://archive.org/download/lp_classical-music-of-india_various/disc1/01.03.%20Jaltarang.mp3',
    dest: 'public/samples/lofi_reality.mp3'
  },
  {
    url: 'https://archive.org/download/lp_classical-music-of-india_various/disc1/01.02.%20Sarangi.mp3',
    dest: 'public/samples/lofi.mp3'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${dest}...`);
    const file = fs.createWriteStream(dest);
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (response) => {
      // Handle redirect
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Redirecting to: ${response.headers.location}`);
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Server returned status code ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        console.log(`Finished ${dest} - Size: ${stats.size} bytes`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of downloads) {
    let success = false;
    let retries = 2;
    while (!success && retries > 0) {
      try {
        await downloadFile(item.url, item.dest);
        success = true;
      } catch (err) {
        console.error(`Failed to download ${item.url}:`, err.message);
        retries--;
        if (retries > 0) {
          console.log('Retrying in 2 seconds...');
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }
  }
  console.log('All downloads completed!');
}

run();
