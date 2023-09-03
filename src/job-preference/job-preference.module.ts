import { Module } from '@nestjs/common';
import { JobPreferenceController } from './job-preference.controller';
import { JobPreferenceService } from './job-preference.service';

@Module({
  controllers: [JobPreferenceController],
  providers: [JobPreferenceService]
})
export class JobPreferenceModule {}
