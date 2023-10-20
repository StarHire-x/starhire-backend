import { Module } from '@nestjs/common';
import { TypeformService } from './typeform.service';
import { TypeformController } from './typeform.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateTypeform } from 'src/entities/corporateTypeform.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobListingService } from 'src/job-listing/job-listing.service';
import { JobListing } from 'src/entities/jobListing.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([CorporateTypeform, Corporate, JobListing]),
  ],
  controllers: [TypeformController],
  providers: [TypeformService, JobListingService],
})
export class TypeformModule {}
