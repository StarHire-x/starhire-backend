import { Module } from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { JobListingController } from './job-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobListing } from 'src/entities/job-listing.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobListing, JobApplication])],
  controllers: [JobListingController],
  providers: [JobListingService],
})
export class JobListingModule {}
