import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Administrator } from '../entities/administrator.entity';
import { Corporate } from '../entities/corporate.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Document } from '../entities/document.entity';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      Administrator,
      Corporate,
      JobSeeker,
      Document,
    ]),
  ],
  controllers: [TicketController],
  providers: [TicketService, EmailService, TwilioService],
})
export class TicketModule {}
