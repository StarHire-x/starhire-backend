import { Module } from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { JobListingController } from './job-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobListing } from 'src/entities/jobListing.entity';
import { Corporate } from 'src/entities/corporate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobListing, Corporate])],
  controllers: [JobListingController],
  providers: [JobListingService],
})
export class JobListingModule {}
