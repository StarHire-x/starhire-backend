import { Module } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from '../entities/recruiter.entity';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobListing } from '../entities/jobListing.entity';
import { JobApplication } from '../entities/jobApplication.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recruiter,
      JobAssignment,
      JobSeeker,
      JobListing,
      JobApplication,
    ]),
  ],
  controllers: [RecruiterController],
  providers: [RecruiterService, EmailService, TwilioService],
})
export class RecruiterModule {}
