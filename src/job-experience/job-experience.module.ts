import { Module } from '@nestjs/common';
import { JobExperienceService } from './job-experience.service';
import { JobExperienceController } from './job-experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobExperience } from 'src/entities/jobExperience.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { EmailModule } from 'src/email/email.module';
import { TwilioModule } from 'src/twilio/twilio.module';
import { Corporate } from 'src/entities/corporate.entity';
import { JobListing } from 'src/entities/jobListing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobExperience, JobSeeker, Corporate, JobListing]), EmailModule, TwilioModule],
  controllers: [JobExperienceController],
  providers: [JobExperienceService, JobSeekerService],
})
export class JobExperienceModule {}
