export const SUPPORTED_INPUT_FORMATS = ['jpg', 'jpeg', 'jfif', 'png', 'webp', 'gif', 'avif'];
export const SUPPORTED_OUTPUT_FORMATS = [
  { value: 'png', label: 'PNG', desc: 'Lossless quality, transparent support' },
  { value: 'jpg', label: 'JPG', desc: 'Compact file size, best for photos' },
  { value: 'webp', label: 'WEBP', desc: 'Modern web format, high compression' },
  { value: 'avif', label: 'AVIF', desc: 'Next-gen format, superior compression' },
  { value: 'gif', label: 'GIF', desc: 'Static image conversion' }
];

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  '.jpg',
  '.jpeg',
  '.jfif',
  '.png',
  '.webp',
  '.gif',
  '.avif'
].join(',');

export function getFileExtension(filename) {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

export function detectFormatFromFilename(filename) {
  const ext = getFileExtension(filename);
  if (ext === 'jpeg' || ext === 'jfif') return 'jpg';
  return ext || 'unknown';
}

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
