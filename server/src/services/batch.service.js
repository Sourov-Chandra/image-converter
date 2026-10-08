import archiver from 'archiver';
import { convertImage } from './image.service.js';
import { buildOutputFilename } from '../utils/filenames.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Concurrency helper to limit parallel Sharp operations
 */
async function mapConcurrent(items, concurrency, fn) {
  const results = new Array(items.length);
  let index = 0;

  const workers = new Array(Math.min(concurrency, items.length)).fill(0).map(async () => {
    while (index < items.length) {
      const currentIndex = index++;
      try {
        results[currentIndex] = { status: 'fulfilled', value: await fn(items[currentIndex], currentIndex) };
      } catch (err) {
        results[currentIndex] = { status: 'rejected', reason: err };
      }
    }
  });

  await Promise.all(workers);
  return results;
}

/**
 * Process a batch of uploaded files and stream a ZIP to the response
 *
 * @param {Array<Express.Multer.File>} files
 * @param {Object} options
 * @param {import('express').Response} res
 */
export async function processBatchConversion(files, options, res) {
  if (!files || files.length === 0) {
    throw new AppError('No files supplied for batch conversion.', 400, 'MISSING_FILE');
  }

  const concurrency = 3; // Bounded concurrency as per specification Section 11.4

  const conversionResults = await mapConcurrent(files, concurrency, async (file) => {
    const inputData = file.buffer || file.path;
    const result = await convertImage(inputData, {
      outputFormat: options.outputFormat,
      quality: options.quality,
      width: options.width,
      height: options.height,
      keepAspectRatio: options.keepAspectRatio,
      background: options.background,
      preserveMetadata: options.preserveMetadata
    });

    const outputFilename = buildOutputFilename(file.originalname, options.outputFormat);
    return {
      filename: outputFilename,
      buffer: result.buffer,
      originalName: file.originalname,
      info: result.info
    };
  });

  const successful = [];
  const failed = [];

  conversionResults.forEach((resItem, idx) => {
    const originalFile = files[idx];
    if (resItem.status === 'fulfilled') {
      successful.push(resItem.value);
    } else {
      failed.push({
        file: originalFile.originalname,
        error: resItem.reason.message || 'Conversion failed'
      });
    }
  });

  if (successful.length === 0) {
    // All conversions failed
    const firstError = conversionResults[0]?.reason;
    throw new AppError(
      firstError?.message || 'All file conversions failed in the batch.',
      firstError?.statusCode || 400,
      firstError?.code || 'CONVERSION_FAILED',
      { failedCount: failed.length, failures: failed }
    );
  }

  // Create ZIP archive
  const archive = archiver('zip', {
    zlib: { level: 6 } // Good compression / speed tradeoff
  });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="converted-images.zip"');
  res.setHeader('X-Total-Files', files.length);
  res.setHeader('X-Successful-Files', successful.length);
  res.setHeader('X-Failed-Files', failed.length);

  archive.pipe(res);

  // Avoid duplicate filenames in the zip
  const usedNames = new Set();
  for (const item of successful) {
    let name = item.filename;
    let counter = 1;
    while (usedNames.has(name)) {
      const dotIndex = item.filename.lastIndexOf('.');
      const base = dotIndex !== -1 ? item.filename.substring(0, dotIndex) : item.filename;
      const ext = dotIndex !== -1 ? item.filename.substring(dotIndex) : '';
      name = `${base}_(${counter})${ext}`;
      counter++;
    }
    usedNames.add(name);
    archive.append(item.buffer, { name });
  }

  // If there are partial failures, include a conversion report in the zip
  if (failed.length > 0) {
    const report = {
      summary: `Successfully converted ${successful.length} of ${files.length} files.`,
      failures: failed
    };
    archive.append(JSON.stringify(report, null, 2), { name: 'conversion-report.json' });
  }

  await archive.finalize();
}
