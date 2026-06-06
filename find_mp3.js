import fs from 'fs';
import path from 'path';

try {
  const content = fs.readFileSync('public/samples/reality.mp3', 'utf-8');
  const matches = content.match(/href="([^"]+\.mp3)"/g) || [];
  console.log('Matches with href:');
  matches.forEach(m => console.log(m));

  const audioSrc = content.match(/src="([^"]+\.mp3)"/g) || [];
  console.log('Matches with src:');
  audioSrc.forEach(m => console.log(m));

  const rawLinks = content.match(/https?:\/\/[^\s"'`<>]+?\.mp3/g) || [];
  console.log('Raw mp3 links:');
  const uniqueLinks = [...new Set(rawLinks)];
  uniqueLinks.forEach(m => console.log(m));
} catch (e) {
  console.error(e);
}
