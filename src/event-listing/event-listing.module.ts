import { Module } from '@nestjs/common';
import { EventListingService } from './event-listing.service';
import { EventListingController } from './event-listing.controller';
import { EventListing } from 'src/entities/eventListing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventListingRepo } from './event-listing.repo';

@Module({
  imports: [TypeOrmModule.forFeature([EventListing])],
  controllers: [EventListingController],
  providers: [EventListingService, EventListingRepo],
})
export class EventListingModule {}
