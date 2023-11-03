import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Public } from '../users/public.decorator';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Public()
  @Post()
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    try {
      return this.ticketService.create(createTicketDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get()
  async findAllTickets() {
    try {
      const result = await this.ticketService.findAll();
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /ticket?id=1
  // @Get()
  // getNinjas(@Query('id') id: number) {
  //   try {
  //     return this.ticketService.findOne(id);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  //     } else {
  //       throw new InternalServerErrorException('Internal server error');
  //     }
  //   }
  // }

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
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedTicket: UpdateTicketDto,
  ) {
    try {
      return this.ticketService.update(id, updatedTicket);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  removeTicket(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.ticketService.remove(id);
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

  @Put('resolve/:id')
  async resolveTicket(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ticketService.resolveTicket(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to resolve ticket');
    }
  }
}
