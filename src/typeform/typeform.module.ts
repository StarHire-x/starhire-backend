import { Module } from '@nestjs/common';
import { TypeformService } from './typeform.service';
import { TypeformController } from './typeform.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateTypeform } from 'src/entities/corporateTypeform.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobListingService } from 'src/job-listing/job-listing.service';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { Administrator } from 'src/entities/administrator.entity';
import { EmailModule } from 'src/email/email.module';
import { TwilioModule } from 'src/twilio/twilio.module';
import { JobseekerTypeform } from 'src/entities/jobseekerTypeform.entity';

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
