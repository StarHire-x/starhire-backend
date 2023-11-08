import { Module } from '@nestjs/common';
import { JobPreferenceController } from './job-preference.controller';
import { JobPreferenceService } from './job-preference.service';
import { JobPreference } from '../entities/jobPreference.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { EmailModule } from '../email/email.module';
import { TwilioModule } from '../twilio/twilio.module';
import { Corporate } from '../entities/corporate.entity';
import { JobListing } from '../entities/jobListing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPreference, JobSeeker, Corporate, JobListing]),
    EmailModule,
    TwilioModule,
  ],
  controllers: [JobPreferenceController],
  providers: [JobPreferenceService, JobSeekerService],
})
export class JobPreferenceModule {}
