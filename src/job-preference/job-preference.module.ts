import { Module } from '@nestjs/common';
import { JobPreferenceController } from './job-preference.controller';
import { JobPreferenceService } from './job-preference.service';
import { JobPreference } from 'src/entities/jobPreference.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPreferenceRepo } from './job-preference.repo';

@Module({
  imports: [TypeOrmModule.forFeature([JobPreference])],
  controllers: [JobPreferenceController],
  providers: [JobPreferenceService, JobPreferenceRepo],
})
export class JobPreferenceModule {}
