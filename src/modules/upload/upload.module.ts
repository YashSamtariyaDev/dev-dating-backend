import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    MulterModule.register(FileUploadService.getMulterOptions()),
  ],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class UploadModule {}
