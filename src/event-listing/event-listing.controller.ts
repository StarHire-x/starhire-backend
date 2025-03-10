import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EventListingService } from './event-listing.service';
import { CreateEventListingDto } from './dto/create-event-listing.dto';
import { UpdateEventListingDto } from './dto/update-event-listing.dto';
import { Public } from 'src/users/public.decorator';

@Controller('event-listing')
export class EventListingController {
  constructor(private readonly eventListingService: EventListingService) {}

  @Post()
  // Note: Ensure dto contains a field for the Id of the parent entity parentId
  createEventListing(@Body() createEventListingDto: CreateEventListingDto) {
    try {
      return this.eventListingService.create(createEventListingDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  //@Public()
  @Get('/premium-events')
  getAllPremiumUsersEvents() {
    try {
      return this.eventListingService.getAllPremiumUsersEvents();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  //@Public()
  @Get('non-premium-events')
  getAllNonPremiumUsersEvents() {
    try {
      return this.eventListingService.getAllNonPremiumUsersEvents();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  //@Public()
  @Get()
  findAllEventListings() {
    try {
      return this.eventListingService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/corporate/:userId')
  async findAllEventListingsByCorporate(@Param('userId') userId: string) {
    try {
      const result = await this.eventListingService.findAllByCorporate(userId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/corporate/eventRegistrations/:id')
  findAllEventRegistrationsByEventListing(@Param('id') id: number) {
    try {
      return this.eventListingService.findAllEventRegistrationsByEventListingId(
        id,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      return this.eventListingService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateEventListing(
    @Param('id') id: number,
    @Body() updateEventListingDto: UpdateEventListingDto,
  ) {
    try {
      return this.eventListingService.update(id, updateEventListingDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id/cancel')
  cancelEventListing(@Param('id') id: number) {
    try {
      return this.eventListingService.cancel(id);
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
      return this.eventListingService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
