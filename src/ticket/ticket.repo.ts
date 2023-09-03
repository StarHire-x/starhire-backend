import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { Repository } from 'typeorm';
import { TicketDetailDto } from './dto/ticket-detail.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketRepo {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  async findAllTickets(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  async findOneTicket(ticketId: number): Promise<Ticket> {
    return await this.ticketRepository.findOneBy({ ticketId: ticketId });
  }

  async createTicket(
    ticketDetails: TicketDetailDto,
  ): Promise<Ticket> {
    const newTicket = this.ticketRepository.create({
      ...ticketDetails,
      submissionDate: new Date(),
    });
    return this.ticketRepository.save(newTicket);
  }

  async deleteTicket(ticketId: number): Promise<void> {
    const ticket = await this.ticketRepository.findOneBy({
      ticketId: ticketId,
    });
    await this.ticketRepository.remove(ticket);
  }

  async updateTicket(
    ticketId: number,
    userDetails: UpdateTicketDto,
  ): Promise<Ticket> {
    const updateResult = await this.ticketRepository.update(
      { ticketId },
      { ...userDetails },
    );
    const updatedTicket: Ticket =
      await this.ticketRepository.findOneBy({ ticketId: ticketId });
    return updatedTicket;
  }
}
