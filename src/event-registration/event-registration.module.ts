import { Module } from '@nestjs/common';
import { EventRegistrationService } from './event-registration.service';
import { EventRegistrationController } from './event-registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistration } from 'src/entities/eventRegistration.entity';
import { EventListing } from 'src/entities/eventListing.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRegistration, EventListing, JobSeeker]),
  ],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
})
export class EventRegistrationModule {}
