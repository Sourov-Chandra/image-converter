import fs from 'fs/promises';
import path from 'path';

/**
 * Idempotently delete a file or directory
 */
export async function safeUnlink(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`[cleanup] Failed to unlink ${filePath}:`, err.message);
    }
  }
}

/**
 * Idempotently delete an array of files
 */
export async function safeUnlinkMany(filePaths = []) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) return;
  await Promise.allSettled(filePaths.map(fp => safeUnlink(fp)));
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.warn(`[cleanup] Failed to create dir ${dirPath}:`, err.message);
    }
  }
}
