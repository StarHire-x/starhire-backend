import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { CreateEventListingDto } from './dto/create-event-listing.dto';
import { UpdateEventListingDto } from './dto/update-event-listing.dto';
import { Repository } from 'typeorm';
import { EventListing } from 'src/entities/eventListing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRegistration } from 'src/entities/eventRegistration.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { mapEventListingStatusToEnum } from 'src/common/mapStringToEnum';

@Injectable()
export class EventListingService {
  constructor(
    @InjectRepository(EventListing)
    private readonly eventListingRepository: Repository<EventListing>,
    // Parent Entity
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
  ) {}

  async create(createEventListingDto: CreateEventListingDto) {
    try {
      // Ensure valid corporate Id is provided
      const { corporateId, ...dtoExcludingParentId } = createEventListingDto;

      const corporate = await this.corporateRepository.findOne({
        where: { userId: corporateId },
      });

      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      // Ensure eventDate is a future date
      if (createEventListingDto.eventDate <= new Date()) {
        throw new HttpException(
          'Event date must be a future date.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Ensure eventListingStatus field is a valid enum
      const mappedStatus = mapEventListingStatusToEnum(
        createEventListingDto.eventListingStatus,
      );
      createEventListingDto.eventListingStatus = mappedStatus;

      // Create the event listing, establishing relationship to parent (corporate entity)
      const eventListing = new EventListing({
        ...dtoExcludingParentId,
        corporate,
      });
      await this.eventListingRepository.save(eventListing);

      if (eventListing) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job listing created',
          data: eventListing,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job listing failed to be created',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to create new event listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    const t = await this.eventListingRepository.find({
      relations: {
        corporate: true,
      },
    });
    return t;
  }

  async findAllByCorporate(id: string) {
    // Find the corporate using the provided user ID
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: id },
        relations: { eventListings: true },
      });

      if (!corporate) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Event listing not found',
          data: [],
        };
      }

      // Fetch event listings that belong to the found corporate
      console.log(corporate.eventListings);
      return {
        statusCode: HttpStatus.OK,
        message: 'Event listing found',
        data: corporate.eventListings,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      // For this part, we want the relationship with other entities to show, at most 1 level, no need to be too detail
      const t = await this.eventListingRepository.findOne({
        where: { eventListingId: id },
        relations: { corporate: true, eventRegistrations: true },
      });
      console.log(t);
      return t;
    } catch (error) {
      throw new HttpException(
        'Failed to find event listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateEventListingDto: UpdateEventListingDto) {
    try {
      const eventListing = await this.eventListingRepository.findOneBy({
        eventListingId: id,
      });

      if (!eventListing) {
        throw new NotFoundException('Event Listing Id provided is not valid');
      }

      Object.assign(eventListing, updateEventListingDto);
      return await this.eventListingRepository.save(eventListing);
    } catch (error) {
      throw new HttpException(
        'Failed to update event listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.eventListingRepository.delete({
        eventListingId: id,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to delete event listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
