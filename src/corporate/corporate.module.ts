import { Module } from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CorporateController } from './corporate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corporate } from '../entities/corporate.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Corporate, JobSeeker])],
  controllers: [CorporateController],
  providers: [CorporateService, EmailService, TwilioService],
})
export class CorporateModule {}
