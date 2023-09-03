import { Module } from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { JobListingController } from './job-listing.controller';

@Module({
  controllers: [JobListingController],
  providers: [JobListingService],
})
export class JobListingModule {}
