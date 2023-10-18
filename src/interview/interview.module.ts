import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { Interview } from 'src/entities/interview.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobApplicationService } from 'src/job-application/job-application.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Interview,
      JobSeeker,
      Corporate,
      Recruiter,
      JobApplication,
    ]),
  ],
  controllers: [InterviewController],
  providers: [InterviewService, JobApplicationService],
})
export class InterviewModule {}
