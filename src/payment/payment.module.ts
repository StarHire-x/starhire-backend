import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CorporateService } from '../corporate/corporate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corporate } from '../entities/corporate.entity';
import { TwilioService } from '../twilio/twilio.service';
import { EmailService } from '../email/email.service';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobListing } from '../entities/jobListing.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { InvoiceService } from 'src/invoice/invoice.service';
import { Invoice } from 'src/entities/invoice.entity';
import { Administrator } from 'src/entities/administrator.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Corporate,
      JobSeeker,
      JobListing,
      JobApplication,
      Invoice,
      Administrator,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, CorporateService, EmailService, TwilioService, PdfService, UploadService, InvoiceService],
})
export class PaymentModule {}
