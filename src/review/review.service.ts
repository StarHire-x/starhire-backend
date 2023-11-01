import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from '../entities/review.entity';
import { mapStarCategoryToEnum } from '../common/mapStringToEnum';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Corporate } from '../entities/corporate.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    // Parent Entity
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,

    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      // Validate corporate and job seeker IDs using validation pipes
      const corporate = await this.corporateRepository.findOne({
        where: { userId: createReviewDto.corporateId },
      });

      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: createReviewDto.jobSeekerId },
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      // Map the rating
      const mappedStatus = mapStarCategoryToEnum(createReviewDto.rating);
      createReviewDto.rating = mappedStatus;

      // Create the review
      const review = new Review(createReviewDto);
      review.corporate = corporate;
      review.jobSeeker = jobSeeker;

      const savedReview = await this.reviewRepository.save(review);

      return {
        statusCode: HttpStatus.OK,
        message: 'Review created',
        data: savedReview,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    const t = await this.reviewRepository.find({
      relations: { corporate: true, jobSeeker: true },
    });
    if (t) {
      return t;
    } else {
      throw new HttpException(
        'Failed to find job Listing',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOne(id: number) {
    try {
      const t = await this.reviewRepository.findOne({
        where: { reviewId: id },
        relations: { corporate: true, jobSeeker: true },
      });
      if (t) {
        return t;
      } else {
        throw new HttpException(
          'Failed to find job Listing',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find job Listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      // Ensure valid job listing Id is provided
      const review = await this.reviewRepository.findOneBy({
        reviewId: id,
      });
      if (!review) {
        throw new NotFoundException('Job Listing Id provided is not valid');
      }

      if (updateReviewDto.rating) {
        const mappedStatus = mapStarCategoryToEnum(updateReviewDto.rating);
        updateReviewDto.rating = mappedStatus;
      }

      Object.assign(review, updateReviewDto);
      await this.reviewRepository.save(review);

      if (review) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Review updated',
          data: review,
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to update review',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.reviewRepository.delete({ reviewId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllByCorporate(id: string) {
    // Find the corporate using the provided user ID
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: id },
        relations: { reviews: true },
      });

      if (!corporate) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Review not found',
          data: [],
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Review found',
        data: corporate.jobListings,
      };
    } catch (err) {
      throw new HttpException('Failed to find Review', HttpStatus.BAD_REQUEST);
    }
  }
}
