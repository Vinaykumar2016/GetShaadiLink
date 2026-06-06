import http from 'https';
import fs from 'fs';
import path from 'path';

const tracks = [
  {
    url: 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-lofi-2487.mp3',
    dest: 'public/samples/lofi.mp3'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} -> ${dest}...`);
    const file = fs.createWriteStream(dest);
    
    const request = http.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Referer': 'https://mixkit.co/'
      }
    }, (response) => {
      // Check if redirect
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Redirecting to ${response.headers.location}...`);
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Completed: ${dest}`);
        resolve();
      });
    });
    
    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function start() {
  const scratchDir = path.join(process.cwd(), 'public', 'samples');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  for (const track of tracks) {
    try {
      await download(track.url, track.dest);
    } catch (err) {
      console.error(`Error downloading ${track.url}:`, err.message);
    }
  }
  console.log('All downloads finished.');
}

start();
