import sharp from 'sharp';
import fs from 'fs';

async function preparePineapple() {
  const input = 'public/pineapple creatine.png';
  
  // 1. Trim & produce clean transparent cutout
  await sharp(input)
    .trim({ threshold: 5 })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile('public/pineapple-creatine-cutout.png');
  
  // 2. High-res gallery version matching front.png
  await sharp(input)
    .trim({ threshold: 5 })
    .resize({ height: 1100, fit: 'inside' })
    .extend({
      top: 50,
      bottom: 50,
      left: 60,
      right: 60,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ quality: 100 })
    .toFile('public/creatine/pineapple-front.png');

  console.log('Successfully prepared Pineapple Creatine images!');
}

preparePineapple().catch(console.error);
