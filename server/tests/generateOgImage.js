import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateOg() {
  const width = 1200;
  const height = 630;
  const logoPath = 'd:/image-converter/client/public/android-chrome-512x512.png';

  const logoResized = await sharp(logoPath)
    .resize(240, 240)
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#090d16" />
        </linearGradient>
        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#818cf8" />
          <stop offset="100%" stop-color="#34d399" />
        </linearGradient>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#bg)" />

      <!-- Accent blur -->
      <circle cx="220" cy="315" r="160" fill="#6366f1" opacity="0.2" />

      <!-- Brand -->
      <text x="380" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="76" font-weight="800" fill="#ffffff" letter-spacing="-1.5">
        Picnito
      </text>

      <!-- Tagline -->
      <text x="380" y="305" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="600" fill="url(#glow)">
        Free Online Image Converter
      </text>

      <!-- Subtitle -->
      <text x="380" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#94a3b8">
        Convert JPG, PNG, WebP, AVIF, JFIF and GIF in seconds.
      </text>
      <text x="380" y="405" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#94a3b8">
        100% Anonymous · Privacy-First · Batch ZIP Download
      </text>

      <!-- Formats Pill -->
      <g transform="translate(380, 450)">
        <rect width="520" height="46" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1" />
        <text x="30" y="29" font-family="monospace" font-size="16" font-weight="700" fill="#38bdf8">
          JPG   •   PNG   •   WEBP   •   AVIF   •   GIF   •   JFIF
        </text>
      </g>

      <!-- Domain -->
      <text x="1080" y="580" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="#64748b">
        picnito.vercel.app
      </text>
    </svg>
  `);

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 9, g: 13, b: 22, alpha: 1 }
    }
  })
    .composite([
      { input: svgOverlay, top: 0, left: 0 },
      { input: logoResized, top: 195, left: 100 }
    ])
    .png()
    .toFile('d:/image-converter/client/public/og-image.png');

  console.log('Successfully generated d:/image-converter/client/public/og-image.png');
}

generateOg().catch(console.error);
