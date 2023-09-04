import { Injectable } from '@nestjs/common';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRegistration } from 'src/entities/eventRegistration.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventRegistrationService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: Repository<EventRegistration>) 
    {}

  async create(createEventRegistrationDto: CreateEventRegistrationDto) {
    try {
      const { ...eventRegistrationDetails } = createEventRegistrationDto;

      const eventRegistration = new EventRegistration({
        ...eventRegistrationDetails,
      });

      return await this.eventRegistrationRepository.save(eventRegistration);
    } catch (error) {
      throw new HttpException(
        'Failed to create new event registration',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.eventRegistrationRepository.find();
  }

  async findOne(id: number) {
   try {
    return await this.eventRegistrationRepository.findOne({
      where: { eventRegistrationId: id },
    });
   } catch (error) {
    throw new HttpException(
      'Failed to find event registration',
      HttpStatus.BAD_REQUEST,
    );
   }
  }

  async update(id: number, updateEventRegistrationDto: UpdateEventRegistrationDto) {
    try {
      const eventRegistration = await this.eventRegistrationRepository.findOneBy({
        eventRegistrationId: id,
      });

      const { ...eventRegistrationDetails } = updateEventRegistrationDto;

      Object.assign(eventRegistration, eventRegistrationDetails);

      return await this.eventRegistrationRepository.save(eventRegistration);
    } catch (error) {
      throw new HttpException(
        'Failed to update event registration',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.eventRegistrationRepository.delete({
        eventRegistrationId: id,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to delete event registration',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
