import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { Interview } from 'src/entities/interview.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobApplicationService } from 'src/job-application/job-application.service';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { Document } from 'src/entities/document.entity';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { RecruiterService } from 'src/recruiter/recruiter.service';
import { CorporateService } from 'src/corporate/corporate.service';

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
