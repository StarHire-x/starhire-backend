import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobSeeker } from './jobSeeker.entity';
import { Corporate } from './corporate.entity';
import ReviewTypeEnum from '../enums/reviewType.enum';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  @IsOptional()
  endDate: Date;

  @Column()
  attitudeJS: number;

  @Column()
  professionalismJS: number;

  @Column()
  passionJS: number;

  @Column()
  benefitsCP: number;

  @Column()
  cultureCP: number;

  @Column()
  growthCP: number;

  @Column({
    type: 'enum',
    enum: ReviewTypeEnum,
    default: ReviewTypeEnum.JOBSEEKER,
  })
  reviewType: ReviewTypeEnum;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.reviews, {
    nullable: false,
  })
  @JoinColumn()
  jobSeeker: JobSeeker;

  @ManyToOne(() => Corporate, (corporate) => corporate.reviews, {
    nullable: false,
  })
  @JoinColumn()
  corporate: Corporate;

  @Column({ nullable: true })
  submissionDate: Date;

  constructor(entity: Partial<Review>) {
    Object.assign(this, entity);
  }
}
