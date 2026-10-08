import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../src/app.js';
import { generateTestFixtures } from './generateFixtures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, 'fixtures');

test('API Integration Tests (Spec Section 7 & 9)', async (t) => {
  await generateTestFixtures();

  await t.test('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
  });

  await t.test('POST /api/v1/convert succeeds for single image with custom headers', async () => {
    const res = await request(app)
      .post('/api/v1/convert')
      .attach('file', path.join(fixturesDir, 'small-photo.jpg'))
      .field('outputFormat', 'png');

    assert.equal(res.status, 200);
    assert.equal(res.header['content-type'], 'image/png');
    assert.match(res.header['content-disposition'], /attachment; filename="small-photo\.png"/);
    assert.ok(res.header['x-original-size']);
    assert.ok(res.header['x-output-size']);
    assert.equal(res.header['x-output-width'], '100');
    assert.equal(res.header['x-output-height'], '100');
    assert.equal(res.header['x-output-format'], 'png');
    assert.ok(Buffer.isBuffer(res.body) || res.body.length > 0);
  });

  await t.test('POST /api/v1/convert returns 400 MISSING_FILE when no file uploaded', async () => {
    const res = await request(app)
      .post('/api/v1/convert')
      .field('outputFormat', 'png');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'MISSING_FILE');
  });

  await t.test('POST /api/v1/convert returns 400 INVALID_OUTPUT_FORMAT for disallowed target', async () => {
    const res = await request(app)
      .post('/api/v1/convert')
      .attach('file', path.join(fixturesDir, 'small-photo.jpg'))
      .field('outputFormat', 'exe');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_OUTPUT_FORMAT');
  });

  await t.test('POST /api/v1/convert returns 400 INVALID_OPTION for invalid quality', async () => {
    const res = await request(app)
      .post('/api/v1/convert')
      .attach('file', path.join(fixturesDir, 'small-photo.jpg'))
      .field('outputFormat', 'webp')
      .field('quality', '150');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_OPTION');
  });

  await t.test('POST /api/v1/convert rejects animated GIF with 400 ANIMATED_IMAGE_UNSUPPORTED', async () => {
    const res = await request(app)
      .post('/api/v1/convert')
      .attach('file', path.join(fixturesDir, 'animated.gif'))
      .field('outputFormat', 'png');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'ANIMATED_IMAGE_UNSUPPORTED');
  });

  await t.test('POST /api/v1/convert rejects corrupt image with 400 INVALID_IMAGE', async () => {
    const res = await request(app)
      .post('/api/v1/convert')
      .attach('file', path.join(fixturesDir, 'corrupt.jpg'))
      .field('outputFormat', 'png');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_IMAGE');
  });

  await t.test('POST /api/v1/convert/batch returns ZIP archive with converted files', async () => {
    const res = await request(app)
      .post('/api/v1/convert/batch')
      .attach('files', path.join(fixturesDir, 'small-photo.jpg'))
      .attach('files', path.join(fixturesDir, 'logo.jfif'))
      .field('outputFormat', 'webp');

    assert.equal(res.status, 200);
    assert.equal(res.header['content-type'], 'application/zip');
    assert.match(res.header['content-disposition'], /attachment; filename="converted-images\.zip"/);
    assert.equal(res.header['x-total-files'], '2');
    assert.equal(res.header['x-successful-files'], '2');
  });
});
