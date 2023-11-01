import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { Interview } from '../entities/interview.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Corporate } from '../entities/corporate.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { JobApplication } from '../entities/jobApplication.entity';
import { JobListing } from '../entities/jobListing.entity';
import { JobApplicationService } from '../job-application/job-application.service';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { Document } from '../entities/document.entity';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { RecruiterService } from '../recruiter/recruiter.service';
import { CorporateService } from '../corporate/corporate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Interview,
      JobSeeker,
      Corporate,
      Recruiter,
      JobApplication,
      JobListing,
      JobAssignment,
      Document,
    ]),
  ],
  controllers: [InterviewController],
  providers: [
    InterviewService,
    JobApplicationService,
    TwilioService,
    EmailService,
    JobSeekerService,
    RecruiterService,
    CorporateService,
  ],
})
export class InterviewModule {}
