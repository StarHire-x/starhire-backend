import { Module } from '@nestjs/common';
import { EventListingService } from './event-listing.service';
import { EventListingController } from './event-listing.controller';
import { EventListing } from 'src/entities/eventListing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corporate } from 'src/entities/corporate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventListing, Corporate])],
  controllers: [EventListingController],
  providers: [EventListingService],
})
export class EventListingModule {}
