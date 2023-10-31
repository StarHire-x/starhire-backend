import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CorporateService } from '../corporate/corporate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corporate } from '../entities/corporate.entity';
import { TwilioService } from '../twilio/twilio.service';
import { EmailService } from '../email/email.service';
import { JobSeeker } from '../entities/jobSeeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Corporate, JobSeeker])],
  controllers: [PaymentController],
  providers: [PaymentService, CorporateService, EmailService, TwilioService],
})
export class PaymentModule {}
