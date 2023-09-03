import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Query,
  Param,
  Delete,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { EventRegistrationService } from './event-registration.service';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';

@Controller('event-registration')
export class EventRegistrationController {
  constructor(
    private readonly eventRegistrationService: EventRegistrationService,
  ) {}

  @Post()
  create(@Body() createEventRegistrationDto: CreateEventRegistrationDto) {
    try {
      return this.eventRegistrationService.create(createEventRegistrationDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/all')
  findAllEventRegistrations() {
    return this.eventRegistrationService.findAll();
  }

  // GET /event-registration?id=1
  @Get()
  getNinjas(@Query('id') id: number) {
    try {
      return this.eventRegistrationService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /event-registration/:id
  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      return this.eventRegistrationService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventRegistrationDto: UpdateEventRegistrationDto,
  ) {
    try {
      return this.eventRegistrationService.update(+id, updateEventRegistrationDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.eventRegistrationService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Event Registration with ID ${id}`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
