import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Administrator } from 'src/entities/administrator.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Administrator, Recruiter, Corporate, JobSeeker])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
