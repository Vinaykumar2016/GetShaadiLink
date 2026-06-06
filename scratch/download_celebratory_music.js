import https from 'https';
import fs from 'fs';
import path from 'path';

const downloads = [
  {
    url: 'https://archive.org/download/a_20230618/B%20-%20Shehanai%20-%20Dhun.mp3',
    dest: 'public/samples/wedding_shehnai_dhun.mp3'
  },
  {
    url: 'https://archive.org/download/kalyan-melam/kalyan%20melam.mp3',
    dest: 'public/samples/kalyan_melam_nadhaswaram.mp3'
  },
  {
    url: 'https://archive.org/download/r-12391441-1534326177-4335/Lok%20Dhun.mp3',
    dest: 'public/samples/celebratory_lok_dhun.mp3'
  },
  {
    url: 'https://archive.org/download/fast_sitar/fast_sitar.mp3',
    dest: 'public/samples/lively_fast_sitar.mp3'
  },
  {
    url: 'https://archive.org/download/r-12391441-1534326177-4335/Dhun%20Mix.mp3',
    dest: 'public/samples/upbeat_dhun_mix.mp3'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${dest}...`);
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const file = fs.createWriteStream(dest);
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (response) => {
      // Handle redirects
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
    let retries = 3;
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
