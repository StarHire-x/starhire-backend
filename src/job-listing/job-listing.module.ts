import { Module } from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { JobListingController } from './job-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobListing } from 'src/entities/jobListing.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { TwilioService } from 'src/twilio/twilio.service';
import { EmailService } from 'src/email/email.service';
import { Administrator } from 'src/entities/administrator.entity';

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
