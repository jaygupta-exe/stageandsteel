import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateWheyLabel() {
  const width = 2048;
  const height = 1024;

  const frontPath = path.join('public', 'whey protein', 'salted caramel', 'Whey_protein_front..png');
  const back1Path = path.join('public', 'whey protein', 'salted caramel', 'whey_protein_back_.png');
  const back2Path = path.join('public', 'whey protein', 'salted caramel', 'whey_proetin_back_2.png');

  // Let's inspect the images and resize them for 360 wrap
  // In a 360 cylinder:
  // Center (x: 512 to 1536) = Front view when facing camera
  // Left (x: 0 to 512) and Right (x: 1536 to 2048) = Back panels when rotated 180 degrees

  // Resize front image to fit nicely in center
  const frontResized = await sharp(frontPath)
    .resize({ height: 860, width: 700, fit: 'inside' })
    .toBuffer();

  const back1Resized = await sharp(back1Path)
    .resize({ height: 780, width: 440, fit: 'inside' })
    .toBuffer();

  const back2Resized = await sharp(back2Path)
    .resize({ height: 780, width: 440, fit: 'inside' })
    .toBuffer();

  // Create high-detail tactical background texture
  const bgSvg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="metalBg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#141413" />
        <stop offset="25%" stop-color="#242422" />
        <stop offset="50%" stop-color="#111110" />
        <stop offset="75%" stop-color="#242422" />
        <stop offset="100%" stop-color="#141413" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#596238" stroke-width="0.3" stroke-opacity="0.15" />
      </pattern>
    </defs>
    
    <!-- Base Fill -->
    <rect width="100%" height="100%" fill="url(#metalBg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>

    <!-- Top & Bottom Stage Gold/Olive Trim Lines -->
    <rect x="0" y="40" width="${width}" height="6" fill="#A8B778" opacity="0.8"/>
    <rect x="0" y="52" width="${width}" height="1.5" fill="#596238" opacity="0.6"/>
    
    <rect x="0" y="${height - 48}" width="${width}" height="6" fill="#A8B778" opacity="0.8"/>
    <rect x="0" y="${height - 56}" width="${width}" height="1.5" fill="#596238" opacity="0.6"/>

    <!-- Left / Back Side Panel Header -->
    <text x="120" y="100" font-family="monospace" font-size="16" font-weight="bold" fill="#A8B778" letter-spacing="4">NUTRITIONAL PROTOCOL // HPLC CERTIFIED</text>
    <text x="120" y="125" font-family="sans-serif" font-size="12" fill="#777773">BATCH CODE: SS-2026-X | ZERO DOPING VERIFIED</text>

    <!-- Right / Back Side Panel Header -->
    <text x="${width - 500}" y="100" font-family="monospace" font-size="16" font-weight="bold" fill="#A8B778" letter-spacing="4">SUGGESTED PROTOCOL // SCIENCE</text>
    <text x="${width - 500}" y="125" font-family="sans-serif" font-size="12" fill="#777773">100% TRANSPARENT FORMULATION MATRIX</text>

    <!-- Tactical Seam Markers -->
    <line x1="20" y1="60" x2="20" y2="${height - 60}" stroke="#596238" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>
    <line x1="${width - 20}" y1="60" x2="${width - 20}" y2="${height - 60}" stroke="#596238" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>
  </svg>
  `;

  // Composite images
  const baseImg = sharp(Buffer.from(bgSvg));

  await baseImg
    .composite([
      {
        input: back1Resized,
        top: 150,
        left: 80,
      },
      {
        input: frontResized,
        top: 80,
        left: Math.floor((width - 700) / 2),
      },
      {
        input: back2Resized,
        top: 150,
        left: width - 520,
      },
    ])
    .toFile(path.join('public', 'whey-3d-wrap-texture.png'));

  console.log('Whey 3D wrap texture successfully generated!');
}

generateWheyLabel().catch(console.error);
