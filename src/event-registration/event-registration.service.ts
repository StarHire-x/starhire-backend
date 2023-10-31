import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRegistration } from 'src/entities/eventRegistration.entity';
import { Repository } from 'typeorm';
import { EventListing } from 'src/entities/eventListing.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Injectable()
export class EventRegistrationService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepository: Repository<EventRegistration>,
    // Inject parent repositories
    @InjectRepository(EventListing)
    private readonly eventListingRepository: Repository<EventListing>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async create(createEventRegistrationDto: CreateEventRegistrationDto) {
    try {
      const { eventListingId, jobSeekerId, ...dtoExcludingParents } =
        createEventRegistrationDto;

      //Ensure valid Parent Ids are provided
      const eventListing = await this.eventListingRepository.findOne({
        where: { eventListingId: eventListingId },
        relations: { corporate: true },
      });

      if (!eventListing) {
        throw new NotFoundException('Event Listing Id provided is not valid');
      }

      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      const corporate = eventListing.corporate;

      // Create the event registration, establishing relationships to parents
      const eventRegistration = new EventRegistration({
        ...dtoExcludingParents,
        eventListing,
        jobSeeker,
      });

      await this.eventRegistrationRepository.save(eventRegistration);

      return {
        statusCode: HttpStatus.OK,
        message: 'Event Registration successfully created',
        data: eventRegistration,
      };
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

  async update(
    id: number,
    updateEventRegistrationDto: UpdateEventRegistrationDto,
  ) {
    try {
      // Ensure valid event regsitration id can be found
      const eventRegistration =
        await this.eventRegistrationRepository.findOneBy({
          eventRegistrationId: id,
        });

      if (!eventRegistration) {
        throw new NotFoundException(
          'Event Registration Id provided is invalid',
        );
      }
      Object.assign(eventRegistration, updateEventRegistrationDto);
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
