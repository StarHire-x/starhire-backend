import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { Repository } from 'typeorm';
import { Corporate } from '../entities/corporate.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import UserRoleEnum from '../enums/userRole.enum';
import ReviewTypeEnum from 'src/enums/reviewType.enum';

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

  async create(createReviewDto: CreateReviewDto, role: string): Promise<any> {
    try {
      const {
        jobSeekerId,
        corporateId,
        submissionDate,
        ...dtoExcludeRelationship
      } = createReviewDto;

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

      let existingReview;

      if (role === UserRoleEnum.CORPORATE) {
        existingReview = await this.reviewRepository.findOne({
          where: {
            jobSeeker: { userId: jobSeekerId },
            corporate: { userId: corporateId },
            reviewType: ReviewTypeEnum.JOBSEEKER,
          },
          relations: { jobSeeker: true, corporate: true },
          order: { submissionDate: 'DESC' },
        });
      } else if (role === UserRoleEnum.JOBSEEKER) {
        existingReview = await this.reviewRepository.findOne({
          where: {
            jobSeeker: { userId: jobSeekerId },
            corporate: { userId: corporateId },
            reviewType: ReviewTypeEnum.CORPORATE,
          },
          relations: { jobSeeker: true, corporate: true },
          order: { submissionDate: 'DESC' },
        });
      }

      if (
        existingReview &&
        new Date(submissionDate) <
          new Date(
            new Date(existingReview.submissionDate).setMonth(
              new Date(existingReview.submissionDate).getMonth() + 1,
            ),
          )
      ) {
        throw new BadRequestException(
          'You cannot submit a review for the same corporate within 1 month of your last review for this corporate',
        );
      }

      const review = this.reviewRepository.create({
        ...dtoExcludeRelationship,
        jobSeeker,
        corporate,
        submissionDate,
      });
      await this.reviewRepository.save(review);

      return {
        statusCode: HttpStatus.OK,
        message: 'Review is created',
        data: review,
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findUserListDropdown(userId: string, role: string) {
    try {
      if (role === UserRoleEnum.JOBSEEKER) {
        const corporates = await this.corporateRepository.find();

        const corporatesList = corporates.map((corporate) => {
          return {
            corporateId: corporate.userId,
            userName: corporate.userName,
          };
        });

        const formattedResponse = corporatesList.map((item) => {
          return {
            key: item.userName,
            value: item.corporateId,
          };
        });

        return {
          statusCode: HttpStatus.OK,
          message: 'List is found',
          data: formattedResponse,
        };
      } else if (role === UserRoleEnum.CORPORATE) {
        const jobSeekers = await this.jobSeekerRepository.find();

        const jobSeekersList = jobSeekers.map((jobSeeker) => {
          return {
            jobSeekerId: jobSeeker.userId,
            userName: jobSeeker.userName,
          };
        });

        const formattedResponse = jobSeekersList.map((item) => {
          return {
            key: item.userName,
            value: item.jobSeekerId,
          };
        });

        return {
          statusCode: HttpStatus.OK,
          message: 'List is found',
          data: formattedResponse,
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByUserIdRole(userId: string, role: string) {
    try {
      if (role === UserRoleEnum.JOBSEEKER) {
        const jobSeeker = await this.jobSeekerRepository.findOne({
          where: { userId: userId },
          relations: ['reviews', 'reviews.corporate', 'reviews.jobSeeker'],
        });

        if (!jobSeeker) {
          throw new NotFoundException('Job Seeker Id provided is not valid');
        }

        return {
          statusCode: HttpStatus.OK,
          message: 'Reviews is found',
          data: jobSeeker.reviews,
        };
      } else if (role === UserRoleEnum.CORPORATE) {
        const corporate = await this.corporateRepository.findOne({
          where: { userId: userId },
          relations: ['reviews', 'reviews.jobSeeker', 'reviews.corporate'],
        });

        if (!corporate) {
          throw new NotFoundException('Job Seeker Id provided is not valid');
        }

        return {
          statusCode: HttpStatus.OK,
          message: 'Reviews is found',
          data: corporate.reviews,
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
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

    const { jobSeekerId, corporateId, ...dtoExcludeRelationship } =
      updateReviewDto;

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
      return {
        statusCode: 200,
        message: 'Review deleted',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
