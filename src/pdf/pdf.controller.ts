import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';
import { UploadService } from '../upload/upload.service';
import { Public } from '../users/public.decorator';
import { PdfService } from './pdf.service';
import { CreateJobSeekerDto } from 'src/job-seeker/dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from 'src/job-seeker/dto/update-job-seeker.dto';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

const unlinkAsync = util.promisify(fs.unlink);

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly uploadService: UploadService,
  ) {}

  //Input parameter can put invoice, company info etc
  @Public()
  @Post()
  async generatePdf(@Body() updatedJobSeeker: any) {

    //give it a unique file name like invoiceid1 etc
    const fileName = updatedJobSeeker.userName + '_resume.pdf';
    console.log(updatedJobSeeker);
    try {
      const pdfBuffer = await this.pdfService.createResume(updatedJobSeeker);
      // THIS PART WILL RETURN THE S3 LINK store it as invoiceLink in a attribute of invoice
      const result = await this.uploadService.upload(fileName, pdfBuffer);
      console.log(result);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
