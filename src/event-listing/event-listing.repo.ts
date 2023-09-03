import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventListing } from 'src/entities/eventListing.entity';
import { Repository } from 'typeorm';
import { EventListingDetailDto } from './dto/event-listing-detail.dto';
import { UpdateEventListingDto } from './dto/update-event-listing.dto';

@Injectable()
export class EventListingRepo {
  constructor(
    @InjectRepository(EventListing)
    private eventListingRepository: Repository<EventListing>,
  ) {}

  async findAllEventListings(): Promise<EventListing[]> {
    return this,this.eventListingRepository.find();
  }

  async findOneEventListing(eventListingId: number): Promise<EventListing> {
    return await this.eventListingRepository.findOneBy( {eventListingId: eventListingId} );
  }

  async createEventListing(eventListingDetails: EventListingDetailDto): Promise<EventListing> {
    const newEventListing = this.eventListingRepository.create( {
        ...eventListingDetails
    });
    return this.eventListingRepository.save(newEventListing);
  }

  async deleteEventListing(eventListingId: number): Promise<void> {
    const eventListing = await this.eventListingRepository.findOneBy( { eventListingId: eventListingId } );
    await this.eventListingRepository.remove(eventListing)
  }

  async updateEventListing(eventListingId: number, eventListingDetails: UpdateEventListingDto): Promise<EventListing> {
    const updateResult = await this.eventListingRepository.update( { eventListingId }, { ...eventListingDetails } );
    const updatedEventListing: EventListing = await this.eventListingRepository.findOneBy( { eventListingId: eventListingId } );
    return updatedEventListing;
  }

}
