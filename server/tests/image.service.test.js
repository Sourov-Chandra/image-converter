import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { generateTestFixtures } from './generateFixtures.js';
import { convertImage } from '../src/services/image.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, 'fixtures');

test('Mandatory Conversion Fixture Matrix (Spec Section 9.2)', async (t) => {
  // Ensure fixtures exist
  await generateTestFixtures();

  await t.test('small-photo.jpg (JPG -> PNG): dimensions preserved', async () => {
    const filePath = path.join(fixturesDir, 'small-photo.jpg');
    const result = await convertImage(filePath, { outputFormat: 'png' });

    assert.equal(result.info.format, 'png');
    assert.equal(result.info.width, 100);
    assert.equal(result.info.height, 100);

    const outMeta = await sharp(result.buffer).metadata();
    assert.equal(outMeta.format, 'png');
    assert.equal(outMeta.width, 100);
    assert.equal(outMeta.height, 100);
  });

  await t.test('small-photo.jpg (JPG -> WEBP): valid webp output', async () => {
    const filePath = path.join(fixturesDir, 'small-photo.jpg');
    const result = await convertImage(filePath, { outputFormat: 'webp', quality: 80 });

    assert.equal(result.info.format, 'webp');
    const outMeta = await sharp(result.buffer).metadata();
    assert.equal(outMeta.format, 'webp');
  });

  await t.test('logo.jfif (JFIF -> PNG): actual image decodes properly', async () => {
    const filePath = path.join(fixturesDir, 'logo.jfif');
    const result = await convertImage(filePath, { outputFormat: 'png' });

    assert.equal(result.info.format, 'png');
    assert.equal(result.info.width, 50);
    assert.equal(result.info.height, 50);
  });

  await t.test('transparent.png (PNG -> JPG): white background by default, alpha flattened', async () => {
    const filePath = path.join(fixturesDir, 'transparent.png');
    const result = await convertImage(filePath, { outputFormat: 'jpeg' });

    assert.equal(result.info.format, 'jpg');
    const outMeta = await sharp(result.buffer).metadata();
    assert.equal(outMeta.format, 'jpeg');
    assert.equal(outMeta.hasAlpha, false);
  });

  await t.test('transparent.png (PNG -> WEBP): alpha channel preserved', async () => {
    const filePath = path.join(fixturesDir, 'transparent.png');
    const result = await convertImage(filePath, { outputFormat: 'webp' });

    assert.equal(result.info.format, 'webp');
    const outMeta = await sharp(result.buffer).metadata();
    assert.equal(outMeta.format, 'webp');
    assert.equal(outMeta.hasAlpha, true);
  });

  await t.test('sample.webp (WEBP -> JPG): valid JPEG output', async () => {
    const filePath = path.join(fixturesDir, 'sample.webp');
    const result = await convertImage(filePath, { outputFormat: 'jpeg' });

    assert.equal(result.info.format, 'jpg');
    const outMeta = await sharp(result.buffer).metadata();
    assert.equal(outMeta.format, 'jpeg');
    assert.equal(outMeta.width, 80);
    assert.equal(outMeta.height, 80);
  });

  await t.test('sample.avif (AVIF -> PNG): valid PNG output', async () => {
    const filePath = path.join(fixturesDir, 'sample.avif');
    const result = await convertImage(filePath, { outputFormat: 'png' });

    assert.equal(result.info.format, 'png');
    const outMeta = await sharp(result.buffer).metadata();
    assert.equal(outMeta.format, 'png');
    assert.equal(outMeta.width, 60);
    assert.equal(outMeta.height, 60);
  });

  await t.test('static.gif (GIF -> PNG): static frame valid', async () => {
    const filePath = path.join(fixturesDir, 'static.gif');
    const result = await convertImage(filePath, { outputFormat: 'png' });

    assert.equal(result.info.format, 'png');
    const outMeta = await sharp(result.buffer).metadata();
    assert.equal(outMeta.format, 'png');
    assert.equal(outMeta.width, 50);
  });

  await t.test('animated.gif (GIF -> PNG): rejected with ANIMATED_IMAGE_UNSUPPORTED', async () => {
    const filePath = path.join(fixturesDir, 'animated.gif');
    await assert.rejects(
      async () => {
        await convertImage(filePath, { outputFormat: 'png' });
      },
      (err) => {
        assert.equal(err.code, 'ANIMATED_IMAGE_UNSUPPORTED');
        assert.match(err.message, /Animated images are not supported yet/);
        return true;
      }
    );
  });

  await t.test('fake-image.exe-renamed.png (fake binary): rejected with INVALID_IMAGE', async () => {
    const filePath = path.join(fixturesDir, 'fake-image.exe-renamed.png');
    await assert.rejects(
      async () => {
        await convertImage(filePath, { outputFormat: 'png' });
      },
      (err) => {
        assert.equal(err.code, 'INVALID_IMAGE');
        return true;
      }
    );
  });

  await t.test('corrupt.jpg (corrupt bytes): rejected with INVALID_IMAGE', async () => {
    const filePath = path.join(fixturesDir, 'corrupt.jpg');
    await assert.rejects(
      async () => {
        await convertImage(filePath, { outputFormat: 'png' });
      },
      (err) => {
        assert.equal(err.code, 'INVALID_IMAGE');
        return true;
      }
    );
  });

  await t.test('resize with keepAspectRatio=true preserves proportions', async () => {
    const filePath = path.join(fixturesDir, 'small-photo.jpg'); // 100x100
    const result = await convertImage(filePath, {
      outputFormat: 'png',
      width: 50,
      height: 50,
      keepAspectRatio: true
    });

    assert.equal(result.info.width, 50);
    assert.equal(result.info.height, 50);
  });
});
