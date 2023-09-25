import { Module } from '@nestjs/common';
import { JobExperienceService } from './job-experience.service';
import { JobExperienceController } from './job-experience.controller';

@Module({
  controllers: [JobExperienceController],
  providers: [JobExperienceService],
})
export class JobExperienceModule {}
