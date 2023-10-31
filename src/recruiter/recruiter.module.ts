import { Module } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruiter } from '../entities/recruiter.entity';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter, JobAssignment, JobSeeker, JobListing, JobApplication])],
  controllers: [RecruiterController],
  providers: [RecruiterService, EmailService, TwilioService],
})
export class RecruiterModule {}
