import { Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { Public } from '../users/public.decorator';
import { UploadService } from '../upload/upload.service';
import * as fs from 'fs';
import * as util from 'util';

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
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        postal_code: 94111,
      },
      items: [
        {
          item: 'TC 100',
          description: 'Toner Cartridge',
          quantity: 2,
          amount: 6000,
        },
        {
          item: 'USB_EXT',
          description: 'USB Cable Extender',
          quantity: 1,
          amount: 2000,
        },
      ],
      subtotal: 8000,
      paid: 0,
      invoice_nr: 1234,
    };

    //give it a unique file name like invoiceid1 etc
    const fileName = 'invoice2.pdf';
  
    try {
      const pdfBuffer = await this.pdfService.createInvoice(
        invoiceData,
        fileName,
      );
      // THIS PART WILL RETURN THE S3 LINK store it as invoiceLink in a attribute of invoice
      return await this.uploadService.upload(fileName, pdfBuffer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    } finally {
      // This will attempt to delete the file regardless of the outcome of the upload.
      try {
        await unlinkAsync(fileName);
      } catch (deleteError) {
        console.error(
          `Failed to delete local PDF file: ${deleteError.message}`,
        );
        // Handle the case where the file deletion fails (e.g., file might not have been created due to an error earlier)
      }
    }
  }
}
