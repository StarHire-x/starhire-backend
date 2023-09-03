import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventRegistration } from "src/entities/eventRegistration.entity";
import { Repository } from "typeorm";
import { EventRegistrationDetailDto } from "./dto/event-registration-detail.dto";
import { UpdateEventRegistrationDto } from "./dto/update-event-registration.dto";

@Injectable()
export class EventRegistrationRepo {
    constructor(
        @InjectRepository(EventRegistration)
        private eventRegistrationRepository: Repository<EventRegistration>,
      ) {}
    
      async findAllEventRegistrations(): Promise<EventRegistration[]> {
        return this,this.eventRegistrationRepository.find();
      }
    
      async findOneEventRegistration(eventRegistrationId: number): Promise<EventRegistration> {
        return await this.eventRegistrationRepository.findOneBy( {eventRegistrationId: eventRegistrationId} );
      }
    
      async createEventRegistration(eventRegistrationDetails: EventRegistrationDetailDto): Promise<EventRegistration> {
        const newEventRegistration = this.eventRegistrationRepository.create( {
            ...eventRegistrationDetails,
        });
        return this.eventRegistrationRepository.save(newEventRegistration);
      }
    
      async deleteEventRegistration(eventRegistrationId: number): Promise<void> {
        const eventRegistration = await this.eventRegistrationRepository.findOneBy( { eventRegistrationId: eventRegistrationId } );
        await this.eventRegistrationRepository.remove(eventRegistration)
      }
    
      async updateEventRegistration(eventRegistrationId: number, eventRegistrationDetails: UpdateEventRegistrationDto): Promise<EventRegistration> {
        const updateResult = await this.eventRegistrationRepository.update( { eventRegistrationId }, { ...eventRegistrationDetails } );
        const updatedEventRegistration: EventRegistration = await this.eventRegistrationRepository.findOneBy( { eventRegistrationId: eventRegistrationId } );
        return updatedEventRegistration;
      }
    
}