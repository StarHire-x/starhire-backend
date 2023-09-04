import { Injectable } from '@nestjs/common';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { EventRegistrationRepo } from './event-registration.repo';

@Injectable()
export class EventRegistrationService {
  constructor(private readonly eventRegistrationRepo: EventRegistrationRepo) {}

  async create(createEventRegistration: CreateEventRegistrationDto) {
    try {
      const { ...eventRegistrationDetail } = createEventRegistration;
      return await this.eventRegistrationRepo.createEventRegistration(eventRegistrationDetail);
    } catch (error) {
      throw new ConflictException("Inserting a duplicate entry into the database. Please check your data.")
    }
  }

  async findAll() {
    return await this.eventRegistrationRepo.findAllEventRegistrations();
  }

  async findOne(id: number) {
    const eventRegistration = await this.eventRegistrationRepo.findOneEventRegistration(id);
    if (eventRegistration == null) {
      throw new NotFoundException(`Event Registration with ID ${id} not found`);
    } else {
      return eventRegistration;
    }
  }

  async update(id: number, updateEventRegistration: UpdateEventRegistrationDto) {
    const eventRegistration = await this.eventRegistrationRepo.findOneEventRegistration(id);
    if (eventRegistration == null) {
      throw new NotFoundException(`Event Registration with ID ${id} not found, Update Unsuccessful`);
    } else {
      return this.eventRegistrationRepo.updateEventRegistration(id, updateEventRegistration);
    }
  }

  async remove(id: number) {
    const eventRegistration = await this.eventRegistrationRepo.findOneEventRegistration(id);
    if (eventRegistration == null) {
      throw new NotFoundException(`Event Registration with ID ${id} not found, Delete Unsuccessful`);
    } else {
      return this.eventRegistrationRepo.deleteEventRegistration(id);
    }
  }
}
