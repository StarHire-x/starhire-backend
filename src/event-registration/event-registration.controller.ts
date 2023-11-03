import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
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
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get()
  findAllEventRegistrations() {
    try {
      return this.eventRegistrationService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/existing/:jobSeekerId/:eventListingId')
  // Check whether an existing event registration has already been created
  async findExistingEventRegistration(
    @Param('jobSeekerId') jobSeekerId: string,
    @Param('eventListingId') eventListingId: number,
  ) {
    try {
      return await this.eventRegistrationService.findEventRegistrationByJobSeekerEventListing(
        jobSeekerId,
        eventListingId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // @Get('event-listing/:eventlistingId')
  // findAllEventRegistrationsByEventListingId(
  //   @Param('eventlistingId') eventListingId: number,
  // ) {
  //   try {
  //     return this.eventRegistrationService.findAllByEventListingId(
  //       eventListingId,
  //     );
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw new HttpException(error.message, HttpStatus.CONFLICT);
  //     } else {
  //       throw new InternalServerErrorException('Internal server error');
  //     }
  //   }
  // }

  // GET /event-registration/:id
  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      return this.eventRegistrationService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateEventRegistrationDto: UpdateEventRegistrationDto,
  ) {
    try {
      return this.eventRegistrationService.update(
        id,
        updateEventRegistrationDto,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    try {
      return this.eventRegistrationService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
