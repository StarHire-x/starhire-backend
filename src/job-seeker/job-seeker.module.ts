import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerRepo } from './job-seeker.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobSeeker])],
  controllers: [JobSeekerController],
  providers: [JobSeekerService, JobSeekerRepo],
})
export class JobSeekerModule {}
