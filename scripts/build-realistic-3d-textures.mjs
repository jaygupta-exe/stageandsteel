import sharp from 'sharp';
import path from 'path';

async function generateUnwrappedLabels() {
  const width = 2048;
  const height = 1024;

  // 1. Whey Protein Unwrapped Label
  // Load back images and crop the actual tables
  const back1 = await sharp('public/whey protein/salted caramel/whey_protein_back_.png')
    .resize({ height: 750, fit: 'inside' })
    .toBuffer();

  const back2 = await sharp('public/whey protein/salted caramel/whey_proetin_back_2.png')
    .resize({ height: 750, fit: 'inside' })
    .toBuffer();

  const logo = await sharp('public/logo stage and steel.png')
    .resize({ width: 620, fit: 'inside' })
    .toBuffer();

  // Create High-Res Ultra-Crisp Unwrapped Label Canvas
  const labelSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="labelBg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ECEBE6" />
        <stop offset="50%" stop-color="#F7F6F3" />
        <stop offset="100%" stop-color="#ECEBE6" />
      </linearGradient>
      <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#151515" fill-opacity="0.08" />
      </pattern>
    </defs>
    
    <!-- White / Cream Matte Label Base -->
    <rect width="100%" height="100%" fill="url(#labelBg)"/>
    <rect width="100%" height="100%" fill="url(#dotGrid)"/>

    <!-- Top & Bottom Black / Gold Borders -->
    <rect x="0" y="0" width="${width}" height="28" fill="#111110"/>
    <rect x="0" y="28" width="${width}" height="8" fill="#A8B778"/>
    
    <rect x="0" y="${height - 36}" width="${width}" height="8" fill="#A8B778"/>
    <rect x="0" y="${height - 28}" width="${width}" height="28" fill="#111110"/>

    <!-- Left & Right Seam Lines -->
    <line x1="30" y1="40" x2="30" y2="${height - 40}" stroke="#596238" stroke-width="2" stroke-dasharray="8,8" opacity="0.3"/>
    <line x1="${width - 30}" y1="40" x2="${width - 30}" y2="${height - 40}" stroke="#596238" stroke-width="2" stroke-dasharray="8,8" opacity="0.3"/>

    <!-- CENTER FRONT BADGE (X: 1024) -->
    <!-- Massive WHEY PROTEIN Title -->
    <text x="1024" y="380" font-family="sans-serif" font-size="110" font-weight="900" fill="#151515" text-anchor="middle" letter-spacing="4">WHEY</text>
    <text x="1024" y="490" font-family="sans-serif" font-size="110" font-weight="900" fill="#151515" text-anchor="middle" letter-spacing="4">PROTEIN</text>

    <!-- Subtitle & Specs Bar -->
    <text x="1024" y="550" font-family="monospace" font-size="22" font-weight="bold" fill="#596238" text-anchor="middle" letter-spacing="8">MICROFILTERED 100% CONCENTRATE</text>

    <!-- 3 Badges (25g Protein, 5.5g BCAA, DigeZyme) -->
    <g transform="translate(680, 600)">
      <rect width="200" height="90" fill="#FFFFFF" stroke="#151515" stroke-opacity="0.2" rx="6"/>
      <text x="100" y="45" font-family="sans-serif" font-size="36" font-weight="900" fill="#151515" text-anchor="middle">25G</text>
      <text x="100" y="72" font-family="monospace" font-size="14" font-weight="bold" fill="#777773" text-anchor="middle">PROTEIN</text>
    </g>

    <g transform="translate(924, 600)">
      <rect width="200" height="90" fill="#FFFFFF" stroke="#151515" stroke-opacity="0.2" rx="6"/>
      <text x="100" y="45" font-family="sans-serif" font-size="36" font-weight="900" fill="#151515" text-anchor="middle">5.5G</text>
      <text x="100" y="72" font-family="monospace" font-size="14" font-weight="bold" fill="#777773" text-anchor="middle">BCAAS</text>
    </g>

    <g transform="translate(1168, 600)">
      <rect width="200" height="90" fill="#FFFFFF" stroke="#151515" stroke-opacity="0.2" rx="6"/>
      <text x="100" y="45" font-family="sans-serif" font-size="26" font-weight="900" fill="#151515" text-anchor="middle">DIGEZYME®</text>
      <text x="100" y="72" font-family="monospace" font-size="14" font-weight="bold" fill="#777773" text-anchor="middle">ENZYMES</text>
    </g>

    <!-- Salted Caramel Banner -->
    <rect x="680" y="725" width="688" height="65" fill="#DE8A36" rx="6"/>
    <text x="1024" y="768" font-family="sans-serif" font-size="34" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">SALTED CARAMEL</text>

    <!-- Net Weight Footer on Front -->
    <text x="1024" y="835" font-family="monospace" font-size="18" font-weight="bold" fill="#777773" text-anchor="middle" letter-spacing="4">NET WT. 1 KG (2.2 LBS) // 30 SERVINGS</text>

    <!-- HPLC Lab Badge on Back -->
    <text x="280" y="110" font-family="monospace" font-size="18" font-weight="bold" fill="#151515" letter-spacing="3">SUPPLEMENT FACTS</text>
    <text x="${width - 480}" y="110" font-family="monospace" font-size="18" font-weight="bold" fill="#151515" letter-spacing="3">DIRECTIONS &amp; PURITY</text>
  </svg>
  `;

  // Composite SVG with brand logo and nutrition tables
  await sharp(Buffer.from(labelSvg))
    .composite([
      // Front Logo
      {
        input: logo,
        top: 80,
        left: 1024 - 310,
      },
      // Left Back Nutrition Table
      {
        input: back1,
        top: 140,
        left: 80,
      },
      // Right Back Amino / Directions Table
      {
        input: back2,
        top: 140,
        left: width - 530,
      },
    ])
    .toFile('public/whey-pure-label-texture.png');

  console.log('Whey pure label texture generated at public/whey-pure-label-texture.png');
}

generateUnwrappedLabels().catch(console.error);
