import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { memoryStorage } from 'multer';

export const storage = memoryStorage();

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('Just images are allowed!'), false);
  }

  cb(null, true);
};

export const limits = {
  // fileSize: 900 * 1024,
};
