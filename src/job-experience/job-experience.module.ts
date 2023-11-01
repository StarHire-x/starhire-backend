import { Module } from '@nestjs/common';
import { JobExperienceService } from './job-experience.service';
import { JobExperienceController } from './job-experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobExperience } from '../entities/jobExperience.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { EmailModule } from '../email/email.module';
import { TwilioModule } from '../twilio/twilio.module';
import { Corporate } from '../entities/corporate.entity';
import { JobListing } from '../entities/jobListing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobExperience, JobSeeker, Corporate, JobListing]),
    EmailModule,
    TwilioModule,
  ],
  controllers: [JobExperienceController],
  providers: [JobExperienceService, JobSeekerService],
})
export class JobExperienceModule {}
