import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobListing } from 'src/entities/jobListing.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobAssignment } from 'src/entities/jobAssignment.entity';

// Ensure imports contain all parent classes
@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobApplication,
      JobListing,
      Recruiter,
      JobSeeker,
      JobAssignment,
    ]),
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
})
export class JobApplicationModule {}
