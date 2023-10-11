import { Module } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from '../entities/recruiter.entity';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter])],
  controllers: [RecruiterController],
  providers: [RecruiterService, EmailService, TwilioService],
})
export class RecruiterModule {}
