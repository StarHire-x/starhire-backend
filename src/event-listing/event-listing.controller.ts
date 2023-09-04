import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  NotFoundException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EventListingService } from './event-listing.service';
import { CreateEventListingDto } from './dto/create-event-listing.dto';
import { UpdateEventListingDto } from './dto/update-event-listing.dto';

@Controller('event-listing')
export class EventListingController {
  constructor(private readonly eventListingService: EventListingService) {}

  @Post()
  create(@Body() createEventListingDto: CreateEventListingDto) {
    try {
      return this.eventListingService.create(createEventListingDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Get('/all')
  findAllEventListings() {
    return this.eventListingService.findAll();
  }

  // GET /event-listing?id=1
  @Get()
  getNinjas(@Query('id') id: number) {
    try {
      return this.eventListingService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  // GET /event-listing/:id
  @Get(':id')
  findOneEventListing(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.eventListingService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  @Put(':id')
  updateEventListing(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventListingDto: UpdateEventListingDto,
  ) {
    try {
      return this.eventListingService.update(+id, updateEventListingDto);
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
      return this.eventListingService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          `Event Listing with ID ${id}`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
