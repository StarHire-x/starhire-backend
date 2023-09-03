import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventListingDto } from './dto/create-event-listing.dto';
import { UpdateEventListingDto } from './dto/update-event-listing.dto';
import { EventListingRepo } from './event-listing.repo';

@Injectable()
export class EventListingService {
  constructor(private readonly eventListingRepo: EventListingRepo) {}

  async create(createEventListing: CreateEventListingDto) {
    try {
      const { ...eventListingDetail } = createEventListing;
      return await this.eventListingRepo.createEventListing(eventListingDetail);
    } catch (error) {
      throw new ConflictException("Inserting a duplicate entry into the database. Please check your data.")
    }
  }

  async findAll() {
    return await this.eventListingRepo.findAllEventListings();
  }

  async findOne(id: number) {
    const eventListing = await this.eventListingRepo.findOneEventListing(id);
    if (eventListing == null) {
      throw new NotFoundException(`Event Listing with ID ${id} not found`);
    } else {
      return eventListing;
    }
  }

  async update(id: number, updateEventListing: UpdateEventListingDto) {
    const eventListing = await this.eventListingRepo.findOneEventListing(id);
    if (eventListing == null) {
      throw new NotFoundException(`Event Listing with ID ${id} not found, Update Unsuccessful`);
    } else {
      return this.eventListingRepo.updateEventListing(id, updateEventListing);
    }
  }

  async remove(id: number) {
    const eventListing = await this.eventListingRepo.findOneEventListing(id);
    if (eventListing == null) {
      throw new NotFoundException(`Event Listing with ID ${id} not found, Delete Unsuccessful`);
    } else {
      return this.eventListingRepo.deleteEventListing(id);
    }
  }
}
