import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { JobAssignmentService } from './job-assignment.service';
import { Recruiter } from '../entities/recruiter.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobListing } from '../entities/jobListing.entity';
import { JobAssignmentController } from './job-assignment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobAssignment, JobListing, JobSeeker, Recruiter]),
  ],
  controllers: [JobAssignmentController],
  providers: [JobAssignmentService],
})
export class JobAssignmentModule {}
