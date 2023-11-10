import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from '../entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Corporate } from '../entities/corporate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, JobSeeker, Corporate]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
