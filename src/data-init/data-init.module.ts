import { Module } from '@nestjs/common';
import { AdministratorService } from '../administrator/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from '../entities/administrator.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { RecruiterService } from 'src/recruiter/recruiter.service';
import { CorporateService } from 'src/corporate/corporate.service';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { DataInitService } from './data-init.service';
import { JobListingService } from 'src/job-listing/job-listing.service';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { EmailModule } from 'src/email/email.module';
import { TwilioModule } from 'src/twilio/twilio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Administrator,
      Recruiter,
      Corporate,
      JobSeeker,
      JobListing,
      JobAssignment,
    ]),
    EmailModule,
    TwilioModule,
  ],
  controllers: [],
  providers: [
    DataInitService,
    AdministratorService,
    RecruiterService,
    CorporateService,
    JobSeekerService,
    JobListingService,
  ],
})
export class DataInitModule {}
