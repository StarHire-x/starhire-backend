import { Injectable, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateEventListingDto } from './dto/create-event-listing.dto';
import { UpdateEventListingDto } from './dto/update-event-listing.dto';
import { Repository } from 'typeorm';
import { EventListing } from 'src/entities/eventListing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRegistration } from 'src/entities/eventRegistration.entity';
import { Corporate } from 'src/entities/corporate.entity';

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

      const eventListing = new EventListing({
        ...dtoExcludingParentId,
        corporate,
      });
      return await this.eventListingRepository.save(eventListing);
    } catch (err) {
      throw new HttpException(
        'Failed to create new event listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.eventListingRepository.find();
  }

  async findOne(id: number) {
    try {
      // For this part, we want the relationship with other entities to show, at most 1 level, no need to be too detail
      return await this.eventListingRepository.findOne({
        where: {eventListingId: id },
        relations: {corporate: true, eventRegistrations: true},
      });
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
        throw new NotFoundException("Event Listing Id provided is not valid");
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
