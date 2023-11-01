import { Module } from '@nestjs/common';
import { TypeformService } from './typeform.service';
import { TypeformController } from './typeform.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateTypeform } from '../entities/corporateTypeform.entity';
import { Corporate } from '../entities/corporate.entity';
import { JobListingService } from '../job-listing/job-listing.service';
import { JobListing } from '../entities/jobListing.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { Administrator } from '../entities/administrator.entity';
import { EmailModule } from '../email/email.module';
import { TwilioModule } from '../twilio/twilio.module';
import { JobseekerTypeform } from '../entities/jobseekerTypeform.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      CorporateTypeform,
      JobseekerTypeform,
      Corporate,
      JobListing,
      JobSeeker,
      Recruiter,
      JobApplication,
      JobAssignment,
      Administrator,
    ]),
    EmailModule,
    TwilioModule,
  ],
  controllers: [TypeformController],
  providers: [TypeformService, JobListingService],
})
export class TypeformModule {}
