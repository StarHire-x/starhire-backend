import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobListing } from '../entities/jobListing.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { SavedJobListing } from '../entities/savedJobListing.entity';

@Injectable()
export class SavedJobListingService {
  constructor(
    @InjectRepository(SavedJobListing)
    private readonly savedJobListingRepository: Repository<SavedJobListing>,
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  findOne(id: number) {
    return `This action returns a #${id} savedJobListing`;
  }

  remove(id: number) {
    return `This action removes a #${id} savedJobListing`;
  }

  async saveJobListing(jobSeekerId: string, jobListingId: number) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
      });
      const jobListing = await this.jobListingRepository.findOne({
        where: { jobListingId: jobListingId },
      });

      if (!jobSeeker) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'JobSeeker not found',
        };
      }

      if (!jobListing) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'JobListing not found',
        };
      }

      const savedJobListing = new SavedJobListing();
      savedJobListing.jobSeeker = jobSeeker;
      savedJobListing.jobListing = jobListing;

      await this.savedJobListingRepository.save(savedJobListing);

      return {
        statusCode: HttpStatus.OK,
        message: 'JobListing saved successfully',
      };
    } catch (error) {
      console.error('Error in saveJobListing:', error);
      throw new HttpException(
        'Failed to save job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findSavedJobListingsByJobSeeker(
    id: string,
  ): Promise<SavedJobListing[]> {
    try {
      const jobListings = await this.savedJobListingRepository
        .createQueryBuilder('savedJobListing')
        .innerJoinAndSelect('savedJobListing.jobListing', 'jobListing')
        .where('savedJobListing.jobSeekerUserId = :userId', { userId: id })
        .getMany();

      if (!jobListings.length) {
        throw new NotFoundException(`No job listings found for user ID ${id}`);
      }

      return jobListings;
    } catch (error) {
      console.error('Error in findSavedJobListingsByJobSeeker: ', error);
      throw error;
    }
  }

  async unsaveJobListing(jobSeekerId: string, jobListingId: number) {
    try {
      const savedJobListing = await this.savedJobListingRepository.findOne({
        where: {
          jobListing: { jobListingId },
          jobSeeker: { userId: jobSeekerId },
        },
      });

      if (!savedJobListing) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Saved JobListing not found',
        };
      }

      await this.savedJobListingRepository.remove(savedJobListing);

      return {
        statusCode: HttpStatus.OK,
        message: 'JobListing unsaved successfully',
      };
    } catch (error) {
      console.error('Error in unsaveJobListing:', error);
      throw new HttpException(
        'Failed to unsave job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async isJobSavedByUser(
    jobSeekerId: string,
    jobListingId: number,
  ): Promise<boolean> {
    const savedJob = await this.savedJobListingRepository.findOne({
      where: {
        jobListing: { jobListingId },
        jobSeeker: { userId: jobSeekerId },
      },
    });

    return !!savedJob;
  }
}
