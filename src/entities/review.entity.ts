import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import StarCategoryEnum from '../enums/starCategory.enum';
import { Corporate } from './corporate.entity';
import { JobSeeker } from './jobSeeker.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: StarCategoryEnum,
    default: StarCategoryEnum.FIVE_STAR,
  })
  @IsEnum(StarCategoryEnum)
  rating: StarCategoryEnum;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Corporate, (corporate) => corporate.reviews)
  corporate: Corporate;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.reviews)
  jobSeeker: JobSeeker;

  constructor(entity: Partial<Review>) {
    Object.assign(this, entity);
  }
}
