import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, 'fixtures');

export async function generateTestFixtures() {
  await fs.mkdir(fixturesDir, { recursive: true });

  // 1. small-photo.jpg (100x100 solid red with pattern)
  await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 3,
      background: { r: 255, g: 0, b: 0 }
    }
  }).jpeg().toFile(path.join(fixturesDir, 'small-photo.jpg'));

  // 2. logo.jfif (same as jpeg bytes, saved as .jfif)
  await sharp({
    create: {
      width: 50,
      height: 50,
      channels: 3,
      background: { r: 0, g: 128, b: 255 }
    }
  }).jpeg().toFile(path.join(fixturesDir, 'logo.jfif'));

  // 3. transparent.png (100x100 with RGBA alpha)
  await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 4,
      background: { r: 0, g: 255, b: 0, alpha: 0.5 }
    }
  }).png().toFile(path.join(fixturesDir, 'transparent.png'));

  // 4. sample.webp (80x80 webp)
  await sharp({
    create: {
      width: 80,
      height: 80,
      channels: 3,
      background: { r: 255, g: 255, b: 0 }
    }
  }).webp().toFile(path.join(fixturesDir, 'sample.webp'));

  // 5. sample.avif (60x60 avif)
  await sharp({
    create: {
      width: 60,
      height: 60,
      channels: 3,
      background: { r: 128, g: 0, b: 128 }
    }
  }).avif().toFile(path.join(fixturesDir, 'sample.avif'));

  // 6. static.gif (50x50 static gif)
  await sharp({
    create: {
      width: 50,
      height: 50,
      channels: 3,
      background: { r: 0, g: 255, b: 255 }
    }
  }).gif().toFile(path.join(fixturesDir, 'static.gif'));

  // 7. fake-image.exe-renamed.png (invalid image bytes: executable-like header)
  const fakeExeBytes = Buffer.from('MZ\x90\x00\x03\x00\x00\x00This is not a real image binary file!');
  await fs.writeFile(path.join(fixturesDir, 'fake-image.exe-renamed.png'), fakeExeBytes);

  // 8. corrupt.jpg (JPEG header followed by garbage bytes)
  const corruptBytes = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x00, 0x00, 0xDE, 0xAD, 0xBE, 0xEF]);
  await fs.writeFile(path.join(fixturesDir, 'corrupt.jpg'), corruptBytes);

  // 9. animated.gif (GIF with multiple frames: GIF89a animation simulation)
  // Standard minimal 2-frame GIF89a
  const animatedGif = Buffer.from(
    '47494638396101000100800000ffffff00000021f90400000000002c000000000100010000020244010021f90400000000002c00000000010001000002024401003b',
    'hex'
  );
  await fs.writeFile(path.join(fixturesDir, 'animated.gif'), animatedGif);
}
