import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEventListingDto } from './dto/create-event-listing.dto';
import { UpdateEventListingDto } from './dto/update-event-listing.dto';
import { Repository } from 'typeorm';
import { EventListing } from 'src/entities/eventListing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRegistration } from 'src/entities/eventRegistration.entity';

@Injectable()
export class EventListingService {
  constructor(
    @InjectRepository(EventListing)
    private readonly eventListingRepository: Repository<EventListing>,
  ) {}

  async create(createEventListingDto: CreateEventListingDto) {
    try {

      // This is to filter out the external relationship in the dto object.
      const { eventRegistrations, ...dtoExcludeRelationship } =
      createEventListingDto;

      // Creating EventListing without the external relationship with other entities.
      const eventListing = new EventListing({
        ...dtoExcludeRelationship,
      });

      // Creating the classes for external relationship with other entities (OneToMany)
      if (createEventListingDto.eventRegistrations.length > 0) {
        const createEventRegistrations = createEventListingDto.eventRegistrations.map(
          (createEventRegistrationDto) => new EventRegistration(createEventRegistrationDto),
        );
        eventListing.eventRegistrations = createEventRegistrations;
      }

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
      // For this part, we want the relationship with other entities to shoe, at most 1 level, no need to be too detail
      return await this.eventListingRepository.findOne({
        where: {eventListingId: id },
        relations: {eventRegistrations: true},
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

      // This is to filter out the external relationships in the dto object
      const { eventRegistrations, ...dtoExcludeRelationship } = 
      updateEventListingDto;

      Object.assign(eventListing, dtoExcludeRelationship);

       // Same thing, u also update the entities with relationship as such
       if (eventRegistrations && eventRegistrations.length > 0) {
        const updatedEventListing = updateEventListingDto.eventRegistrations.map(
          (createEventRegistrationDto) => {
            return new EventRegistration(createEventRegistrationDto);
          },
        );
        return await this.eventListingRepository.save(eventListing);
       }
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
