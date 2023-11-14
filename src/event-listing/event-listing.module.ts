import { Module } from '@nestjs/common';
import { EventListingService } from './event-listing.service';
import { EventListingController } from './event-listing.controller';
import { EventListing } from '../entities/eventListing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corporate } from '../entities/corporate.entity';
import { EventRegistration } from '../entities/eventRegistration.entity';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventListing, Corporate, EventRegistration]),
  ],
  controllers: [EventListingController],
  providers: [EventListingService, EmailService, TwilioService],
})
export class EventListingModule {}
