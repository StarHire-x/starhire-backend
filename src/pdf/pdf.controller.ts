import {
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
  async generatePdf() {
    //Replace with invoice data etc
    const invoiceData = {
      shipping: {
        name: 'John Doe',
        address: '1234 Main Street',
      },
      items: [
        {
          jobApplicationId: 1,
          jobListingTitle: 'Chinese Teacher',
          amount: 6000,
        },
        {
          jobApplicationId: 2,
          jobListingTitle: 'English Teacher',
          amount: 6500,
        },
      ],
      subtotal: 8000,
      paid: 8000,
      invoice_nr: 1,
    };

    //give it a unique file name like invoiceid1 etc
    const fileName = 'invoice2.pdf';

    try {
      const pdfBuffer = await this.pdfService.createInvoice(invoiceData);
      // THIS PART WILL RETURN THE S3 LINK store it as invoiceLink in a attribute of invoice
      return await this.uploadService.upload(fileName, pdfBuffer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
