import sharp from 'sharp';

async function generateCreatineUnwrappedLabel() {
  const width = 2048;
  const height = 1024;

  const logo = await sharp('public/logo stage and steel.png')
    .resize({ width: 580, fit: 'inside' })
    .toBuffer();

  const labelSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="creatineBg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#E8E8E4" />
        <stop offset="50%" stop-color="#F5F5F2" />
        <stop offset="100%" stop-color="#E8E8E4" />
      </linearGradient>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#creatineBg)"/>

    <rect x="0" y="0" width="${width}" height="28" fill="#111110"/>
    <rect x="0" y="28" width="${width}" height="8" fill="#A8B778"/>
    
    <rect x="0" y="${height - 36}" width="${width}" height="8" fill="#A8B778"/>
    <rect x="0" y="${height - 28}" width="${width}" height="28" fill="#111110"/>

    <!-- CENTER FRONT BADGE -->
    <text x="1024" y="380" font-family="sans-serif" font-size="110" font-weight="900" fill="#151515" text-anchor="middle" letter-spacing="4">CREAPURE®</text>
    <text x="1024" y="490" font-family="sans-serif" font-size="100" font-weight="900" fill="#151515" text-anchor="middle" letter-spacing="4">CREATINE</text>
    <text x="1024" y="550" font-family="monospace" font-size="22" font-weight="bold" fill="#596238" text-anchor="middle" letter-spacing="8">100% GERMAN MICRONIZED MONOHYDRATE</text>

    <!-- 3 Specs Badges -->
    <g transform="translate(680, 600)">
      <rect width="200" height="90" fill="#FFFFFF" stroke="#151515" stroke-opacity="0.2" rx="6"/>
      <text x="100" y="45" font-family="sans-serif" font-size="36" font-weight="900" fill="#151515" text-anchor="middle">5000MG</text>
      <text x="100" y="72" font-family="monospace" font-size="14" font-weight="bold" fill="#777773" text-anchor="middle">CREAPURE</text>
    </g>

    <g transform="translate(924, 600)">
      <rect width="200" height="90" fill="#FFFFFF" stroke="#151515" stroke-opacity="0.2" rx="6"/>
      <text x="100" y="45" font-family="sans-serif" font-size="36" font-weight="900" fill="#151515" text-anchor="middle">99.9%</text>
      <text x="100" y="72" font-family="monospace" font-size="14" font-weight="bold" fill="#777773" text-anchor="middle">PURITY</text>
    </g>

    <g transform="translate(1168, 600)">
      <rect width="200" height="90" fill="#FFFFFF" stroke="#151515" stroke-opacity="0.2" rx="6"/>
      <text x="100" y="45" font-family="sans-serif" font-size="36" font-weight="900" fill="#151515" text-anchor="middle">200</text>
      <text x="100" y="72" font-family="monospace" font-size="14" font-weight="bold" fill="#777773" text-anchor="middle">MESH ULTRA-FINE</text>
    </g>

    <!-- Purity Banner -->
    <rect x="680" y="725" width="688" height="65" fill="#596238" rx="6"/>
    <text x="1024" y="768" font-family="sans-serif" font-size="30" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">UNFLAVORED RAW PURITY</text>
    <text x="1024" y="835" font-family="monospace" font-size="18" font-weight="bold" fill="#777773" text-anchor="middle" letter-spacing="4">NET WT. 300G (0.66 LBS) // 60 SERVINGS</text>

    <!-- Left Back Info Box -->
    <rect x="80" y="140" width="460" height="700" fill="#FFFFFF" stroke="#151515" stroke-opacity="0.2" rx="6"/>
    <text x="110" y="200" font-family="monospace" font-size="24" font-weight="bold" fill="#151515">SUPPLEMENT FACTS</text>
    <text x="110" y="235" font-family="sans-serif" font-size="14" fill="#777773">Serving Size: 1 Scoop (5g) | Servings: 60</text>
    <line x1="110" y1="260" x2="500" y2="260" stroke="#151515" stroke-width="2"/>
    <text x="110" y="310" font-family="sans-serif" font-size="18" font-weight="bold" fill="#151515">Creapure® Creatine Monohydrate</text>
    <text x="440" y="310" font-family="monospace" font-size="18" font-weight="bold" fill="#596238">5,000 mg</text>
    <line x1="110" y1="340" x2="500" y2="340" stroke="#151515" stroke-opacity="0.1" stroke-width="1"/>
    <text x="110" y="390" font-family="sans-serif" font-size="15" fill="#555555">• HPLC 3rd Party Laboratory Certified</text>
    <text x="110" y="430" font-family="sans-serif" font-size="15" fill="#555555">• 100% German Creapure® Monohydrate</text>
    <text x="110" y="470" font-family="sans-serif" font-size="15" fill="#555555">• Zero sugars, zero fats, zero fillers</text>
    <text x="110" y="510" font-family="sans-serif" font-size="15" fill="#555555">• Rapid ATP and cellular volumization</text>
    <text x="110" y="580" font-family="monospace" font-size="16" font-weight="bold" fill="#596238">BATCH NO: CR-2026-GER</text>

    <!-- Right Back Directions Box -->
    <rect x="${width - 540}" y="140" width="460" height="700" fill="#FFFFFF" stroke="#151515" stroke-opacity="0.2" rx="6"/>
    <text x="${width - 510}" y="200" font-family="monospace" font-size="24" font-weight="bold" fill="#151515">SUGGESTED USE</text>
    <text x="${width - 510}" y="250" font-family="sans-serif" font-size="15" fill="#555555">
      <tspan x="${width - 510}" dy="0">Mix 1 scoop (5g) with 250ml cold water</tspan>
      <tspan x="${width - 510}" dy="30">or your post-workout Stage Whey Protein shake.</tspan>
      <tspan x="${width - 510}" dy="30">Consume daily for optimal phosphocreatine</tspan>
      <tspan x="${width - 510}" dy="30">cellular saturation.</tspan>
    </text>
    <line x1="${width - 510}" y1="400" x2="${width - 110}" y2="400" stroke="#151515" stroke-opacity="0.1" stroke-width="1"/>
    <text x="${width - 510}" y="450" font-family="monospace" font-size="16" font-weight="bold" fill="#596238">CGMP &amp; WADA COMPLIANT</text>
    <text x="${width - 510}" y="485" font-family="sans-serif" font-size="14" fill="#777773">Formulated under strict pharma conditions</text>
  </svg>
  `;

  await sharp(Buffer.from(labelSvg))
    .composite([
      {
        input: logo,
        top: 80,
        left: 1024 - 290,
      },
    ])
    .toFile('public/creatine-pure-label-texture.png');

  console.log('Creatine pure label texture generated!');
}

generateCreatineUnwrappedLabel().catch(console.error);
