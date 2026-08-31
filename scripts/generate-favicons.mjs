import sharp from "sharp";
import path from "path";
import fs from "fs";

const publicDir = path.join(process.cwd(), "public");
const appDir = path.join(process.cwd(), "app");
const sourceLogo = path.join(publicDir, "logo stage and steel.png");

async function generateFavicons() {
  console.log("Generating favicons and site icons from:", sourceLogo);
  
  if (!fs.existsSync(sourceLogo)) {
    console.error("Source logo not found!");
    return;
  }

  // Trim whitespace/transparent padding from logo first
  const trimmedBuffer = await sharp(sourceLogo)
    .trim()
    .toBuffer();

  // Create high-res 512x512 icon with sleek dark theme background or transparent with padding
  const size512 = 512;
  const padding = 40; // 40px padding inside 512x512
  const innerSize = size512 - padding * 2;

  const resizedLogo = await sharp(trimmedBuffer)
    .resize(innerSize, innerSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  // Composite on circular / rounded dark badge (or transparent) for maximum visibility in Google Search & Tabs
  const icon512 = await sharp({
    create: {
      width: size512,
      height: size512,
      channels: 4,
      background: { r: 10, g: 12, b: 10, alpha: 1 }, // Dark luxury Stage & Steel brand background
    },
  })
    .composite([{ input: resizedLogo, gravity: "center" }])
    .png()
    .toBuffer();

  // Write app/icon.png (Next.js automatically serves this as standard favicon/app icon)
  fs.writeFileSync(path.join(appDir, "icon.png"), icon512);
  fs.writeFileSync(path.join(publicDir, "icon.png"), icon512);
  fs.writeFileSync(path.join(publicDir, "android-chrome-512x512.png"), icon512);

  // 192x192
  const icon192 = await sharp(icon512).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "android-chrome-192x192.png"), icon192);

  // 180x180 Apple Touch Icon
  const appleIcon = await sharp(icon512).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(appDir, "apple-icon.png"), appleIcon);
  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), appleIcon);

  // 32x32 Favicon
  const icon32 = await sharp(icon512).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "favicon-32x32.png"), icon32);

  // 16x16 Favicon
  const icon16 = await sharp(icon512).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, "favicon-16x16.png"), icon16);

  // Convert to ICO format (32x32)
  fs.writeFileSync(path.join(appDir, "favicon.ico"), icon32);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icon32);

  // Web manifest
  const manifest = {
    name: "Stage & Steel",
    short_name: "Stage&Steel",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#596238",
    background_color: "#0a0c0a",
    display: "standalone",
  };
  fs.writeFileSync(path.join(publicDir, "site.webmanifest"), JSON.stringify(manifest, null, 2));

  console.log("All favicons & Google Search brand icons generated successfully!");
}

generateFavicons().catch(console.error);
