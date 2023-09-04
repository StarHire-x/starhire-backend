import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
  ParseIntPipe,
  Query,
  ConflictException,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    try {
      return this.ticketService.create(createTicketDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/all')
  findAllTickets() {
    return this.ticketService.findAll();
  }

  // GET /ticket?id=1
  @Get()
  getNinjas(@Query('id') id: number) {
    try {
      return this.ticketService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /ticket/:id
  @Get(':id')
  findOneTicket(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.ticketService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateTicket(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    try {
      return this.ticketService.update(+id, updateTicketDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeTicket(@Param('id', ParseIntPipe) id: string) {
    try {
      return this.ticketService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Ticket with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}





