import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Corporate } from 'src/entities/corporate.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Corporate, JobSeeker])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
