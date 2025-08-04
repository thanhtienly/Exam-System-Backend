import { BadRequestException, Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';

@Injectable()
export class FileUploadService {
  constructor() {}

  handleTestQuestionUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // validate file type
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      unlinkSync(file.path);
      throw new BadRequestException('Invalid file type');
    }

    return { fileName: file.filename, filePath: file.path };
  }
}
