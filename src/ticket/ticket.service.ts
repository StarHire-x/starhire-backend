import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TicketRepo } from './ticket.repo';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepo: TicketRepo) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      const { ...ticketDetail } = createTicketDto;
      return await this.ticketRepo.createTicket(ticketDetail);
    } catch (err) {
      throw new ConflictException(
        'Inserting a duplicate entry into the database. Please check your data.',
      );
    }
  }

  async findAll() {
    return await this.ticketRepo.findAllTickets();
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepo.findOneTicket(id);
    if (ticket === null) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    } else {
      return ticket;
    }
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketRepo.findOneTicket(id);
    if (ticket === null) {
      throw new NotFoundException(
        `Ticket with ID ${id} not found, Update Unsuccessful`,
      );
    } else {
      return await this.ticketRepo.updateTicket(id, updateTicketDto);
    }
  }

  async remove(id: number) {
    const ticket = await this.ticketRepo.findOneTicket(id);
    if (ticket === null) {
      throw new NotFoundException(
        `Ticket with ID ${id} not found, Delete Unsuccessful`,
      );
    } else {
      return await this.ticketRepo.deleteTicket(id);
    }
  }
}







