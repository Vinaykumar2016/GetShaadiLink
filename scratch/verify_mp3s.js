import fs from 'fs';
import path from 'path';

const files = [
  "pal_pal_dil_ke_paas.mp3",
  "ek_pyar_ka_nagma_hai.mp3",
  "janam_janam_ka_saath_hai.mp3",
  "gaata_rahe_mera_dil.mp3",
  "main_shayar_to_nahin.mp3",
  "aaja_sanam_madhur_chandni.mp3"
];

files.forEach(file => {
  const filePath = path.join('public/samples', file);
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(10);
    fs.readSync(fd, buffer, 0, 10, 0);
    fs.closeSync(fd);
    
    const hex = buffer.toString('hex');
    const text = buffer.toString('utf-8');
    const isID3 = buffer.slice(0, 3).toString('utf-8') === 'ID3';
    const isMP3Frame = buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0;
    
    console.log(`${file}:`);
    console.log(`  Size: ${fs.statSync(filePath).size} bytes`);
    console.log(`  First 10 bytes (hex): ${hex}`);
    console.log(`  First 10 bytes (text): ${text.replace(/[\x00-\x1F\x7F-\xFF]/g, '.')}`);
    console.log(`  Valid ID3 Header? ${isID3 ? 'YES' : 'NO'}`);
    console.log(`  Valid MP3 Frame? ${isMP3Frame ? 'YES' : 'NO'}`);
    
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      console.log(`  WARNING: THIS LOOKS LIKE AN HTML FILE!`);
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});
