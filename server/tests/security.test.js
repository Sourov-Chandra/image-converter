import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../src/app.js';
import { config } from '../src/config/env.js';
import { generateTestFixtures } from './generateFixtures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, 'fixtures');

test('Security & Limit Tests (Spec Section 9.3)', async (t) => {
  await generateTestFixtures();

  await t.test('File exceeding max file size is rejected with 413 FILE_TOO_LARGE', async () => {
    // Generate a buffer 1 byte larger than maxFileSizeBytes
    const oversizedBuffer = Buffer.alloc(config.maxFileSizeBytes + 1024, 0);

    const res = await request(app)
      .post('/api/v1/convert')
      .attach('file', oversizedBuffer, 'oversized.jpg')
      .field('outputFormat', 'png');

    assert.equal(res.status, 413);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'FILE_TOO_LARGE');
  });

  await t.test('Batch exceeding max files count is rejected with 413 TOO_MANY_FILES', async () => {
    const reqInstance = request(app)
      .post('/api/v1/convert/batch')
      .field('outputFormat', 'png');

    // Attach MAX_FILES_PER_BATCH + 1 files
    const dummyFile = path.join(fixturesDir, 'small-photo.jpg');
    for (let i = 0; i < config.maxFilesPerBatch + 1; i++) {
      reqInstance.attach('files', dummyFile);
    }

    const res = await reqInstance;
    assert.equal(res.status, 413);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'TOO_MANY_FILES');
  });

  await t.test('Invalid quality or dimensions returns 400 INVALID_OPTION', async () => {
    const res = await request(app)
      .post('/api/v1/convert')
      .attach('file', path.join(fixturesDir, 'small-photo.jpg'))
      .field('outputFormat', 'webp')
      .field('width', '-50');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_OPTION');
  });
});
