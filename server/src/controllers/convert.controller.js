import { convertImage } from '../services/image.service.js';
import { processBatchConversion } from '../services/batch.service.js';
import { buildOutputFilename } from '../utils/filenames.js';
import { getMimeType } from '../utils/format.js';

/**
 * Controller for single image conversion
 */
export async function convertSingle(req, res, next) {
  try {
    const file = req.file;
    const options = req.conversionOptions;

    const inputData = file.buffer || file.path;
    const result = await convertImage(inputData, options);

    const outputFilename = buildOutputFilename(file.originalname, options.outputFormat);
    const contentType = getMimeType(result.info.format);

    // Set specified response headers per Section 7.3
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.setHeader('X-Original-Size', result.info.originalSize || file.size);
    res.setHeader('X-Output-Size', result.info.size);
    res.setHeader('X-Output-Width', result.info.width);
    res.setHeader('X-Output-Height', result.info.height);
    res.setHeader('X-Output-Format', result.info.format);

    // Send binary converted image
    res.status(200).send(result.buffer);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller for batch image conversion
 */
export async function convertBatch(req, res, next) {
  try {
    const files = req.batchFiles;
    const options = req.conversionOptions;

    await processBatchConversion(files, options, res);
  } catch (err) {
    next(err);
  }
}
