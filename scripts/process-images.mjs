import sharp from 'sharp';

async function processCreatineClean() {
  const { data, info } = await sharp('public/creatine.jpg.jpeg')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outputData = Buffer.from(data);

  // Background removal via flood fill
  const visited = new Uint8Array(width * height);
  const queue = [];

  const isBgSeed = (r, g, b) => r > 240 && g > 240 && b > 240;

  // Add borders
  for (let x = 0; x < width; x++) {
    const idxTop = (0 * width + x) * channels;
    if (isBgSeed(data[idxTop], data[idxTop + 1], data[idxTop + 2])) {
      queue.push(0 * width + x);
      visited[0 * width + x] = 1;
    }
    const idxBottom = ((height - 1) * width + x) * channels;
    if (isBgSeed(data[idxBottom], data[idxBottom + 1], data[idxBottom + 2])) {
      queue.push((height - 1) * width + x);
      visited[(height - 1) * width + x] = 1;
    }
  }

  for (let y = 0; y < height; y++) {
    const idxLeft = (y * width + 0) * channels;
    if (!visited[y * width + 0] && isBgSeed(data[idxLeft], data[idxLeft + 1], data[idxLeft + 2])) {
      queue.push(y * width + 0);
      visited[y * width + 0] = 1;
    }
    const idxRight = (y * width + (width - 1)) * channels;
    if (!visited[y * width + (width - 1)] && isBgSeed(data[idxRight], data[idxRight + 1], data[idxRight + 2])) {
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

        // If high brightness or near-white background:
        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        // More strict threshold near bottom to eliminate shadow boundary
        const isWhite = (minVal > 220 && (maxVal - minVal) < 20) || (minVal > 235);

        if (isWhite) {
          visited[nPos] = 1;
          queue.push(nPos);
        }
      }
    }
  }

  // Set transparency
  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const px = i % width;
    const py = Math.floor(i / width);

    if (visited[i]) {
      outputData[idx + 3] = 0;
    } else {
      // Clean up any stray background around bottom
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // If below bottle baseline and bright/grey, fade out smoothly
      if (py > height * 0.88) {
        if (r > 200 && g > 200 && b > 200) {
          const fade = Math.max(0, (255 - r) / 55);
          outputData[idx + 3] = Math.round(outputData[idx + 3] * fade);
        }
      }

      // Edge antialiasing
      let bgCount = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = px + dx;
          const ny = py + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (visited[ny * width + nx]) bgCount++;
          }
        }
      }
      if (bgCount > 0) {
        const brightness = (r + g + b) / 3;
        if (brightness > 215) {
          const alpha = Math.max(0, Math.min(255, Math.round((255 - brightness) / 40 * 255)));
          outputData[idx + 3] = Math.min(outputData[idx + 3], alpha);
        }
      }
    }
  }

  // Trim transparent edges
  await sharp(outputData, { raw: { width, height, channels } })
    .trim()
    .png()
    .toFile('public/creatine-cutout.png');

  console.log('Clean creatine cutout generated!');
}

async function processWheyClean() {
  const { data, info } = await sharp('public/whey protein.PNG')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outputData = Buffer.from(data);

  const visited = new Uint8Array(width * height);
  const queue = [];

  const isBgSeed = (r, g, b) => r > 240 && g > 240 && b > 240;

  for (let x = 0; x < width; x++) {
    const idxTop = (0 * width + x) * channels;
    if (isBgSeed(data[idxTop], data[idxTop + 1], data[idxTop + 2])) {
      queue.push(0 * width + x);
      visited[0 * width + x] = 1;
    }
    const idxBottom = ((height - 1) * width + x) * channels;
    if (isBgSeed(data[idxBottom], data[idxBottom + 1], data[idxBottom + 2])) {
      queue.push((height - 1) * width + x);
      visited[(height - 1) * width + x] = 1;
    }
  }

  for (let y = 0; y < height; y++) {
    const idxLeft = (y * width + 0) * channels;
    if (!visited[y * width + 0] && isBgSeed(data[idxLeft], data[idxLeft + 1], data[idxLeft + 2])) {
      queue.push(y * width + 0);
      visited[y * width + 0] = 1;
    }
    const idxRight = (y * width + (width - 1)) * channels;
    if (!visited[y * width + (width - 1)] && isBgSeed(data[idxRight], data[idxRight + 1], data[idxRight + 2])) {
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

        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const isWhite = (minVal > 225 && (maxVal - minVal) < 20) || (minVal > 238);

        if (isWhite) {
          visited[nPos] = 1;
          queue.push(nPos);
        }
      }
    }
  }

  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const px = i % width;
    const py = Math.floor(i / width);

    if (visited[i]) {
      outputData[idx + 3] = 0;
    } else {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      if (py > height * 0.90) {
        if (r > 210 && g > 210 && b > 210) {
          const fade = Math.max(0, (255 - r) / 45);
          outputData[idx + 3] = Math.round(outputData[idx + 3] * fade);
        }
      }

      let bgCount = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = px + dx;
          const ny = py + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (visited[ny * width + nx]) bgCount++;
          }
        }
      }
      if (bgCount > 0) {
        const brightness = (r + g + b) / 3;
        if (brightness > 215) {
          const alpha = Math.max(0, Math.min(255, Math.round((255 - brightness) / 40 * 255)));
          outputData[idx + 3] = Math.min(outputData[idx + 3], alpha);
        }
      }
    }
  }

  await sharp(outputData, { raw: { width, height, channels } })
    .trim()
    .png()
    .toFile('public/whey-cutout.png');

  console.log('Clean whey cutout generated!');
}

async function run() {
  await processWheyClean();
  await processCreatineClean();
}

run().catch(console.error);
