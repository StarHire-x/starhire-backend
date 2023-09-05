import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Corporate } from 'src/entities/corporate.entity';
import { EventListing } from 'src/entities/eventListing.entity';
import { JobListing } from 'src/entities/jobListing.entity';

@Injectable()
export class CorporateService {
  constructor(
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
  ) {}

  async create(createCorporateDto: CreateCorporateDto) {
    try {
      const { eventListings, jobListings, ...dtoExcludeRelationship } =
        createCorporateDto;

      const corporate = new Corporate(dtoExcludeRelationship);

      // Creating the Classes for external relationship with other entities (OneToMany)

      // 1. EventListing
      if (eventListings.length > 0) {
        const createEventListings = eventListings.map(
          (createEventListingDto) => {
            const { eventRegistrations, ...dtoExcludeRelationship } =
              createEventListingDto;
            return new EventListing(dtoExcludeRelationship);
          },
        );
        corporate.eventListings = createEventListings;
      }

      // 2. JobListings
      if (jobListings.length > 0) {
        const createJobListings = jobListings.map((createJobListingDto) => {
          const { jobApplications, ...dtoExcludeRelationship } =
            createJobListingDto;
          return new JobListing(dtoExcludeRelationship);
        });
        corporate.jobListings = createJobListings;
      }

      // create and save corporate object to db
      return await this.corporateRepository.save(corporate);
    } catch (err) {
      throw new HttpException(
        'Failed to create new corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.corporateRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.corporateRepository.findOne({
        where: { userId: id },
        relations: { eventListings: true, jobListings: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find a corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateCorporateDto: UpdateCorporateDto) {
    try {
      // find an existing corporate first
      const corporate = await this.corporateRepository.findOneBy({
        userId: id,
      });

      const { eventListings, jobListings, ...dtoExcludeRelationship } =
        updateCorporateDto;

      Object.assign(corporate, dtoExcludeRelationship);

      // 1. EventListing
      if (eventListings.length > 0) {
        const updatedEventListings = eventListings.map(
          (createEventListingDto) => {
            const { eventRegistrations, ...dtoExcludeRelationship } =
              createEventListingDto;
            return new EventListing(dtoExcludeRelationship);
          },
        );
        corporate.eventListings = updatedEventListings;
      }

      // 2. JobListings
      if (jobListings.length > 0) {
        const updatedJobListings = jobListings.map((createJobListingDto) => {
          const { jobApplications, ...dtoExcludeRelationship } =
            createJobListingDto;
          return new JobListing(dtoExcludeRelationship);
        });
        corporate.jobListings = updatedJobListings;
      }

      // create and save corporate object to db
      return await this.corporateRepository.save(corporate);
    } catch (err) {
      throw new HttpException(
        'Failed to update a corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.corporateRepository.delete({ userId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete a corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
