import { Module } from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { JobListingController } from './job-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobListing } from 'src/entities/jobListing.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobListing,
      Corporate,
      JobApplication,
      JobSeeker,
    ]),
  ],
  controllers: [JobListingController],
  providers: [JobListingService],
  exports: [TypeOrmModule.forFeature([JobListing])],
})
export class JobListingModule {}
