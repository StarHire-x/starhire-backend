import { Module } from '@nestjs/common';
import { SavedJobListingService } from './saved-job-listing.service';
import { SavedJobListingController } from './saved-job-listing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedJobListing } from 'src/entities/savedJobListing.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedJobListing, JobListing, JobSeeker])],
  controllers: [SavedJobListingController],
  providers: [SavedJobListingService],
})
export class SavedJobListingModule {}
