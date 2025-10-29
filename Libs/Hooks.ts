import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrTesseractService {
  private readonly logger = new Logger(OcrTesseractService.name);

  private readonly panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/g;
  private readonly aadharRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;

  // Step 1: preprocess image
  private async preprocessImage(buffer: Buffer) {
    return sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .grayscale()
      .normalize()
      .toFormat('png')
      .toBuffer();
  }

  // Step 2: OCR extraction
  async extractPanAadhar(buffer: Buffer) {
    const worker = await createWorker('eng');

    try {
      const preprocessed = await this.preprocessImage(buffer);

      await worker.load();
      await worker.reinitialize('eng');

      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
      });

      const { data } = await worker.recognize(preprocessed);
      const text = data?.text ?? '';

      const panMatches = (text.match(this.panRegex) || []).map(s => s.trim());
      const aadharMatches = (text.match(this.aadharRegex) || []).map(s =>
        s.replace(/\s+/g, ''),
      );

      return {
        success: true,
        text,
        pan_matches: panMatches,
        aadhar_matches: aadharMatches,
      };
    } catch (err) {
      this.logger.error('Tesseract OCR failed', err);
      return {
        success: false,
        error: 'OCR processing failed',
        details: err.message,
      };
    } finally {
      await worker.terminate();
    }
  }
}
