import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CorporateService } from 'src/corporate/corporate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corporate } from 'src/entities/corporate.entity';
import { TwilioService } from 'src/twilio/twilio.service';
import { EmailService } from 'src/email/email.service';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Corporate, JobSeeker, JobListing, JobApplication])],
  controllers: [PaymentController],
  providers: [PaymentService, CorporateService, EmailService, TwilioService],
})
export class PaymentModule {}
