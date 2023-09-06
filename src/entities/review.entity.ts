import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import StarCategoryEnum from 'src/enums/starCategory.enum';
import { Corporate } from './corporate.entity';
import { JobSeeker } from './jobSeeker.entity';

@Entity('reviews')
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
}