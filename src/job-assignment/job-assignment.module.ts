import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { JobAssignmentService } from './job-assignment.service';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobAssignmentController } from './job-assignment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobAssignment, JobListing, JobSeeker, Recruiter])],
  controllers: [JobAssignmentController],
  providers: [JobAssignmentService],
})
export class JobAssignmentModule {}
