import { Module } from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { JobListingController } from './job-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobListing } from '../entities/jobListing.entity';
import { Corporate } from '../entities/corporate.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { TwilioService } from '../twilio/twilio.service';
import { EmailService } from '../email/email.service';
import { Administrator } from '../entities/administrator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobListing,
      Corporate,
      JobApplication,
      JobSeeker,
      Recruiter,
      JobAssignment,
      Administrator,
    ]),
  ],
  controllers: [JobListingController],
  providers: [JobListingService, TwilioService, EmailService],
  exports: [TypeOrmModule.forFeature([JobListing])],
})
export class JobListingModule {}
