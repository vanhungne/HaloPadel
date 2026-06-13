const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
const appDir = path.join(__dirname, '..', 'src', 'app');
const publicDir = path.join(__dirname, '..', 'public');

async function generateFavicon() {
  console.log('Generating favicon and icons from logo...');

  // Generate favicon.ico (32x32) - place in src/app for Next.js auto-detection
  await sharp(logoPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(appDir, 'icon.png'));
  console.log('✅ icon.png (32x32) → src/app/');

  // Generate apple-icon.png (180x180) for Apple devices
  await sharp(logoPath)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));
  console.log('✅ apple-icon.png (180x180) → src/app/');

  // Generate larger icon for OG/manifest (512x512)
  await sharp(logoPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✅ icon-512.png (512x512) → public/');

  // Generate 192x192 for PWA manifest
  await sharp(logoPath)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✅ icon-192.png (192x192) → public/');

  console.log('\nDone! Next.js will auto-detect icon.png and apple-icon.png from src/app/');
}

generateFavicon().catch(console.error);
