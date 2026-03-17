import { Injectable } from '@nestjs/common';
import { memoryStorage } from 'multer';

@Injectable()
export class FileUploadService {
  static getMulterOptions() {
    return {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1, // Only 1 file at a time
      },
    };
  }

  static getProfilePhotoUrl(filename: string): string {
    return `/uploads/profile-photos/${filename}`;
  }
}
