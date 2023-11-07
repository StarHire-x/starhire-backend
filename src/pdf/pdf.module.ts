import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { UploadService } from '../upload/upload.service';

@Module({
  controllers: [PdfController],
  providers: [PdfService, UploadService],
})
export class PdfModule {}
