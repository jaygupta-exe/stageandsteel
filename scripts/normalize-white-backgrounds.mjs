import sharp from 'sharp';
import fs from 'fs';

async function processWhiteBackground(filePath) {
  const fileBuf = fs.readFileSync(filePath);
  const { data, info } = await sharp(fileBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);

  // Flood fill / replace background near-white/light-grey pixels with pure 255, 255, 255
  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    if (r > 218 && g > 218 && b > 218 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
      out[idx] = 255;
      out[idx + 1] = 255;
      out[idx + 2] = 255;
      out[idx + 3] = 255;
    }
  }

  let finalBuf;
  if (filePath.endsWith('.PNG') || filePath.endsWith('.png')) {
    finalBuf = await sharp(out, { raw: info }).png().toBuffer();
  } else {
    finalBuf = await sharp(out, { raw: info }).jpeg({ quality: 98 }).toBuffer();
  }

  fs.writeFileSync(filePath, finalBuf);
  console.log('Normalized white bg:', filePath);
}

async function run() {
  const files = [
    'public/whey protein/salted caramel/Whey protein salted.JPG.jpeg',
    'public/whey protein/salted caramel/sakted caramel back.PNG',
    'public/whey protein/salted caramel/salted caramel back 1.PNG',
    'public/creatine/creatine front.jpg.jpeg',
    'public/creatine/creatine back 1jpg.jpeg',
    'public/creatine/creatine back 2.jpg.jpeg',
  ];

  for (const f of files) {
    if (fs.existsSync(f)) {
      await processWhiteBackground(f);
    }
  }
  console.log('All image backgrounds normalized to pure 255, 255, 255!');
}

run().catch(console.error);
