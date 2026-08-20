import sharp from 'sharp';
import fs from 'fs';

async function perfectCutout({
  inputPath,
  outputPath,
  bgThreshold = 200,
  bottomTrimPercent = 0.94,
  erodePixels = 2,
}) {
  console.log(`Processing perfect cutout: ${inputPath} -> ${outputPath}`);

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outputData = Buffer.from(data);
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Seed boundary
  for (let x = 0; x < width; x++) {
    queue.push(0 * width + x);
    visited[0 * width + x] = 1;
    queue.push((height - 1) * width + x);
    visited[(height - 1) * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    if (!visited[y * width + 0]) {
      queue.push(y * width + 0);
      visited[y * width + 0] = 1;
    }
    if (!visited[y * width + (width - 1)]) {
      queue.push(y * width + (width - 1));
      visited[y * width + (width - 1)] = 1;
    }
  }

  let head = 0;
  while (head < queue.length) {
    const pos = queue[head++];
    const px = pos % width;
    const py = Math.floor(pos / width);

    const neighbors = [
      py > 0 ? (py - 1) * width + px : -1,
      py < height - 1 ? (py + 1) * width + px : -1,
      px > 0 ? py * width + (px - 1) : -1,
      px < width - 1 ? py * width + (px + 1) : -1,
    ];

    for (const nPos of neighbors) {
      if (nPos >= 0 && !visited[nPos]) {
        const nIdx = nPos * channels;
        const r = data[nIdx];
        const g = data[nIdx + 1];
        const b = data[nIdx + 2];
        const a = data[nIdx + 3];

        if (a < 15) {
          visited[nPos] = 1;
          queue.push(nPos);
          continue;
        }

        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const diff = maxVal - minVal;
        const brightness = (r + g + b) / 3;

        const isBottomArea = py > height * (bottomTrimPercent - 0.05);
        const isBg = (minVal > bgThreshold && diff < 35) ||
                     brightness > 225 ||
                     (isBottomArea && brightness > 130 && diff < 30) ||
                     (py > height * bottomTrimPercent && brightness > 70);

        if (isBg) {
          visited[nPos] = 1;
          queue.push(nPos);
        }
      }
    }
  }

  // Alpha mask array
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    mask[i] = visited[i] ? 0 : 255;
  }

  // Erode mask by `erodePixels` to remove 100% of white edge fringe
  const erodedMask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (mask[idx] === 0) {
        erodedMask[idx] = 0;
        continue;
      }

      let minDistToBg = 99;
      for (let dy = -erodePixels; dy <= erodePixels; dy++) {
        for (let dx = -erodePixels; dx <= erodePixels; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height || mask[ny * width + nx] === 0) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDistToBg) minDistToBg = dist;
          }
        }
      }

      if (minDistToBg <= erodePixels) {
        // Soft feather transition
        const alphaFraction = Math.max(0, (minDistToBg - 0.5) / (erodePixels - 0.5));
        erodedMask[idx] = Math.round(alphaFraction * 255);
      } else {
        erodedMask[idx] = 255;
      }
    }
  }

  // Apply eroded mask & edge color correction
  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const px = i % width;
    const py = Math.floor(i / width);
    const alpha = erodedMask[i];

    outputData[idx + 3] = alpha;

    if (alpha > 0 && alpha < 255) {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = (r + g + b) / 3;

      // Darken bright edges near black plastic regions (cap / base)
      const isDarkRegion = py < height * 0.18 || py > height * 0.82 || brightness < 150;
      if (isDarkRegion) {
        outputData[idx] = Math.min(25, Math.round(r * 0.2));
        outputData[idx + 1] = Math.min(25, Math.round(g * 0.2));
        outputData[idx + 2] = Math.min(25, Math.round(b * 0.2));
      }
    }
  }

  // Trim transparent padding & save high quality PNG
  await sharp(outputData, { raw: { width, height, channels } })
    .trim({ threshold: 5 })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Saved clean cutout: ${outputPath}`);
}

async function main() {
  // 1. Mocha Protein Cutout
  await perfectCutout({
    inputPath: 'public/whey protein/mocha protein/mocha protein.PNG',
    outputPath: 'public/mocha-protein-cutout.png',
    bgThreshold: 205,
    bottomTrimPercent: 0.94,
    erodePixels: 2,
  });

  // 2. Creatine Cutout
  await perfectCutout({
    inputPath: 'public/creatine/creatine front.jpg.jpeg',
    outputPath: 'public/creatine-cutout.png',
    bgThreshold: 195,
    bottomTrimPercent: 0.92,
    erodePixels: 2.5,
  });

  // 3. Belgium Chocolate Cutout
  await perfectCutout({
    inputPath: 'public/whey protein/belgium chocalte/belgium chocalte.PNG',
    outputPath: 'public/belgium-chocolate-cutout.png',
    bgThreshold: 210,
    bottomTrimPercent: 0.94,
    erodePixels: 2,
  });

  // 4. Primary Hero Whey Cutout
  await perfectCutout({
    inputPath: 'public/whey protein/belgium chocalte/belgium chocalte.PNG',
    outputPath: 'public/whey-cutout.png',
    bgThreshold: 210,
    bottomTrimPercent: 0.94,
    erodePixels: 2,
  });

  // 5. Salted Caramel Cutout
  await perfectCutout({
    inputPath: 'public/whey protein/salted caramel/Whey protein salted.JPG.jpeg',
    outputPath: 'public/salted-caramel-cutout.png',
    bgThreshold: 210,
    bottomTrimPercent: 0.94,
    erodePixels: 2,
  });

  console.log('All cutouts successfully cleaned and defringed!');
}

main().catch(console.error);
