import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSavedJobListingDto } from './dto/create-saved-job-listing.dto';
import { UpdateSavedJobListingDto } from './dto/update-saved-job-listing.dto';
import { JobListing } from 'src/entities/jobListing.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { SavedJobListing } from 'src/entities/savedJobListing.entity';

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

  create(createSavedJobListingDto: CreateSavedJobListingDto) {
    return 'This action adds a new savedJobListing';
  }

  findAll() {
    return `This action returns all savedJobListing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} savedJobListing`;
  }

  update(id: number, updateSavedJobListingDto: UpdateSavedJobListingDto) {
    return `This action updates a #${id} savedJobListing`;
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
      throw error; // Handle database or any other errors, you can further refine this part
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

  // async checkIfJobIsSaved(
  //   jobSeekerId: string,
  //   jobListingId: number,
  // ): Promise<boolean> {
  //   try {
  //     const existingSavedJobListing =
  //       await this.savedJobListingRepository.findOne({
  //         where: {
  //           jobSeeker: { userId: jobSeekerId },
  //           jobListing: { jobListingId: jobListingId },
  //         },
  //       });

  //     return !!existingSavedJobListing; // returns true if found, false otherwise
  //   } catch (error) {
  //     console.error('Error in checkIfJobIsSaved:', error);
  //     throw new HttpException(
  //       'Failed to check if job listing is saved',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

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
