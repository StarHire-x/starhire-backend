import { Module } from '@nestjs/common';
import { EventRegistrationService } from './event-registration.service';
import { EventRegistrationController } from './event-registration.controller';
import { EventRegistrationRepo } from './event-registration.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistration } from 'src/entities/eventRegistration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventRegistration])],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService, EventRegistrationRepo],
})
export class EventRegistrationModule {}
