import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { JobApplication } from '../entities/jobApplication.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobListing } from '../entities/jobListing.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { Document } from '../entities/document.entity';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';

// Ensure imports contain all parent classes
@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobApplication,
      JobListing,
      Recruiter,
      JobSeeker,
      JobAssignment,
      Document,
    ]),
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, EmailService, TwilioService],
})
export class JobApplicationModule {}
