import { Module } from '@nestjs/common';
import { JobExperienceService } from './job-experience.service';
import { JobExperienceController } from './job-experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobExperience } from 'src/entities/jobExperience.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobExperience, JobSeeker]), EmailModule],
  controllers: [JobExperienceController],
  providers: [JobExperienceService, JobSeekerService],
})
export class JobExperienceModule {}
