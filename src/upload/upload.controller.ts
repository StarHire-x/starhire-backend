import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Public } from 'src/users/public.decorator';


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg/md'}),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log("File Upload Triggered");
    return await this.uploadService.upload(file.originalname, file.buffer);
  }
}
