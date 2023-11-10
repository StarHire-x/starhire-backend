import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { Repository } from 'typeorm';
import { Corporate } from '../entities/corporate.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const { jobSeekerId, corporateId, ...dtoExcludeRelationship } =
        createReviewDto;
      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      const corporate = await this.corporateRepository.findOneBy({
        userId: corporateId,
      });

      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      const review = new Review({
        ...dtoExcludeRelationship,
        jobSeeker,
        corporate,
      });
      await this.reviewRepository.save(review);
      return {
        statusCode: HttpStatus.OK,
        message: 'Review is created',
        data: review,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const reviews = await this.reviewRepository.find();
      return reviews;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { reviewId: id },
        relations: { jobSeeker: true, corporate: true },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      return review;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (!review) {
      throw new NotFoundException('Review Id provided is not valid');
    }

    const { jobSeekerId, corporateId, ...dtoExcludeRelationship } = updateReviewDto;

    Object.assign(review, dtoExcludeRelationship);

    await this.reviewRepository.save(review);

    return {
      statusCode: 200,
      message: 'Review updated',
      data: review,
    }; 
  }

  async remove(id: number) {
    try {
      const result = await this.reviewRepository.delete({ reviewId: id });
      if (result.affected === 0) {
        throw new HttpException('Review id not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
