import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateCreatineLabel() {
  const width = 2048;
  const height = 1024;

  const frontPath = path.join('public', 'creatine-cutout.png');

  const frontResized = await sharp(frontPath)
    .resize({ height: 860, width: 700, fit: 'inside' })
    .toBuffer();

  const bgSvg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="metalBg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#141413" />
        <stop offset="25%" stop-color="#222220" />
        <stop offset="50%" stop-color="#10100f" />
        <stop offset="75%" stop-color="#222220" />
        <stop offset="100%" stop-color="#141413" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#596238" stroke-width="0.3" stroke-opacity="0.15" />
      </pattern>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#metalBg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>

    <rect x="0" y="40" width="${width}" height="6" fill="#A8B778" opacity="0.8"/>
    <rect x="0" y="52" width="${width}" height="1.5" fill="#596238" opacity="0.6"/>
    
    <rect x="0" y="${height - 48}" width="${width}" height="6" fill="#A8B778" opacity="0.8"/>
    <rect x="0" y="${height - 56}" width="${width}" height="1.5" fill="#596238" opacity="0.6"/>

    <!-- Left Back Info Box -->
    <rect x="80" y="140" width="460" height="700" fill="#181817" stroke="#596238" stroke-width="1" rx="4"/>
    <text x="110" y="190" font-family="monospace" font-size="20" font-weight="bold" fill="#A8B778" letter-spacing="2">SUPPLEMENT FACTS</text>
    <text x="110" y="220" font-family="sans-serif" font-size="13" fill="#777773">Serving Size: 1 Scoop (5g) | Servings: 60</text>
    <line x1="110" y1="240" x2="500" y2="240" stroke="#596238" stroke-width="1.5"/>
    <text x="110" y="280" font-family="sans-serif" font-size="16" font-weight="bold" fill="#F4F4F1">Creapure® Creatine Monohydrate</text>
    <text x="440" y="280" font-family="monospace" font-size="16" font-weight="bold" fill="#A8B778">5,000 mg</text>
    <line x1="110" y1="310" x2="500" y2="310" stroke="#F4F4F1" stroke-opacity="0.1" stroke-width="1"/>
    <text x="110" y="360" font-family="sans-serif" font-size="13" fill="#C4C3BE">Purity standard: 99.9% German Creapure</text>
    <text x="110" y="390" font-family="sans-serif" font-size="13" fill="#C4C3BE">Micronized mesh rating: 200 Mesh</text>
    <text x="110" y="420" font-family="sans-serif" font-size="13" fill="#C4C3BE">Zero artificial flavors, dyes or fillers</text>
    <text x="110" y="480" font-family="monospace" font-size="14" font-weight="bold" fill="#A8B778">HPLC 3RD PARTY TESTED</text>
    <text x="110" y="510" font-family="sans-serif" font-size="12" fill="#777773">BATCH: CR-2026-GER</text>

    <!-- Right Back Directions Box -->
    <rect x="${width - 540}" y="140" width="460" height="700" fill="#181817" stroke="#596238" stroke-width="1" rx="4"/>
    <text x="${width - 510}" y="190" font-family="monospace" font-size="20" font-weight="bold" fill="#A8B778" letter-spacing="2">SUGGESTED USE</text>
    <text x="${width - 510}" y="230" font-family="sans-serif" font-size="13" fill="#C4C3BE" width="400">
      <tspan x="${width - 510}" dy="0">Mix 1 scoop (5g) with 250ml of cold water</tspan>
      <tspan x="${width - 510}" dy="25">or your post-workout Stage Whey Protein shake.</tspan>
      <tspan x="${width - 510}" dy="25">Consume daily for optimal phosphocreatine</tspan>
      <tspan x="${width - 510}" dy="25">cellular saturation.</tspan>
    </text>
    <line x1="${width - 510}" y1="360" x2="${width - 110}" y2="360" stroke="#596238" stroke-width="1"/>
    <text x="${width - 510}" y="400" font-family="monospace" font-size="14" font-weight="bold" fill="#A8B778">CELL VOLUMIZATION MATRIX</text>
    <text x="${width - 510}" y="430" font-family="sans-serif" font-size="12" fill="#777773">GERMAN CREAPURE® LICENSED</text>
    <text x="${width - 510}" y="460" font-family="sans-serif" font-size="12" fill="#777773">CERTIFIED CGMP &amp; WADA COMPLIANT</text>
  </svg>
  `;

  await sharp(Buffer.from(bgSvg))
    .composite([
      {
        input: frontResized,
        top: 80,
        left: Math.floor((width - 700) / 2),
      },
    ])
    .toFile(path.join('public', 'creatine-3d-wrap-texture.png'));

  console.log('Creatine 3D wrap texture successfully generated!');
}

generateCreatineLabel().catch(console.error);
