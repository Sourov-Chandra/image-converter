import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeFormat,
  normalizeOutputExtension,
  isInputFormatSupported,
  isOutputFormatSupported,
  getMimeType,
  supportsAlpha
} from '../src/utils/format.js';
import {
  sanitizeBasename,
  buildOutputFilename
} from '../src/utils/filenames.js';

test('Format Utilities', async (t) => {
  await t.test('normalizeFormat handles variations correctly', () => {
    assert.equal(normalizeFormat('JPG'), 'jpeg');
    assert.equal(normalizeFormat('.jfif'), 'jpeg');
    assert.equal(normalizeFormat('PNG'), 'png');
    assert.equal(normalizeFormat('WEBP'), 'webp');
    assert.equal(normalizeFormat('AVIF'), 'avif');
  });

  await t.test('normalizeOutputExtension returns clean extension', () => {
    assert.equal(normalizeOutputExtension('jpeg'), 'jpg');
    assert.equal(normalizeOutputExtension('jpg'), 'jpg');
    assert.equal(normalizeOutputExtension('png'), 'png');
    assert.equal(normalizeOutputExtension('webp'), 'webp');
    assert.equal(normalizeOutputExtension('avif'), 'avif');
  });

  await t.test('isInputFormatSupported verifies allowed formats', () => {
    assert.equal(isInputFormatSupported('jpg'), true);
    assert.equal(isInputFormatSupported('jpeg'), true);
    assert.equal(isInputFormatSupported('jfif'), true);
    assert.equal(isInputFormatSupported('png'), true);
    assert.equal(isInputFormatSupported('webp'), true);
    assert.equal(isInputFormatSupported('gif'), true);
    assert.equal(isInputFormatSupported('avif'), true);
    assert.equal(isInputFormatSupported('exe'), false);
    assert.equal(isInputFormatSupported('pdf'), false);
  });

  await t.test('isOutputFormatSupported verifies targets', () => {
    assert.equal(isOutputFormatSupported('jpg'), true);
    assert.equal(isOutputFormatSupported('png'), true);
    assert.equal(isOutputFormatSupported('webp'), true);
    assert.equal(isOutputFormatSupported('avif'), true);
    assert.equal(isOutputFormatSupported('gif'), true);
    assert.equal(isOutputFormatSupported('bmp'), false);
    assert.equal(isOutputFormatSupported('tiff'), false);
  });

  await t.test('getMimeType maps correctly', () => {
    assert.equal(getMimeType('jpeg'), 'image/jpeg');
    assert.equal(getMimeType('jpg'), 'image/jpeg');
    assert.equal(getMimeType('png'), 'image/png');
    assert.equal(getMimeType('webp'), 'image/webp');
    assert.equal(getMimeType('avif'), 'image/avif');
  });

  await t.test('supportsAlpha identifies alpha-capable formats', () => {
    assert.equal(supportsAlpha('png'), true);
    assert.equal(supportsAlpha('webp'), true);
    assert.equal(supportsAlpha('avif'), true);
    assert.equal(supportsAlpha('jpeg'), false);
    assert.equal(supportsAlpha('jpg'), false);
  });
});

test('Filename Sanitization', async (t) => {
  await t.test('sanitizeBasename strips unsafe characters and path traversal', () => {
    assert.equal(sanitizeBasename('../../etc/passwd'), 'passwd');
    assert.equal(sanitizeBasename('..\\..\\windows\\system32'), 'system32');
    assert.equal(sanitizeBasename('photo:test*name?.jpg'), 'photo_test_name_');
    assert.equal(sanitizeBasename('normal_image.png'), 'normal_image');
    assert.equal(sanitizeBasename(''), 'image');
    assert.equal(sanitizeBasename('...'), 'image');
  });

  await t.test('buildOutputFilename replaces extension safely', () => {
    assert.equal(buildOutputFilename('sample.jpg', 'png'), 'sample.png');
    assert.equal(buildOutputFilename('../../test.image.jfif', 'webp'), 'test.image.webp');
    assert.equal(buildOutputFilename('photo.png', 'jpeg'), 'photo.jpg');
  });
});
