import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { R2StorageService } from './r2-storage.service';

@Module({
  imports: [
    MulterModule.register(FileUploadService.getMulterOptions()),
  ],
  providers: [FileUploadService, R2StorageService],
  exports: [FileUploadService, R2StorageService],
})
export class UploadModule {}
