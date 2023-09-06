import { Module } from '@nestjs/common';
import { JobPreferenceController } from './job-preference.controller';
import { JobPreferenceService } from './job-preference.service';
import { JobPreference } from 'src/entities/jobPreference.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPreference, JobSeeker])],
  controllers: [JobPreferenceController],
  providers: [JobPreferenceService, JobSeekerService],
})
export class JobPreferenceModule {}
