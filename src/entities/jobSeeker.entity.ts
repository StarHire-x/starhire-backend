import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from './user.entity';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { Blob } from 'buffer';

@Entity({ name: 'jobSeekers' })
export class JobSeeker extends User {
  @Column()
  @IsOptional()
  resumePdf!: Buffer | null;

  @Column()
  fullName: string;

  @Column()
  dateOfBirth: Date;

  @IsEnum(HighestEducationStatusEnum)
  highestEducationStatus: HighestEducationStatusEnum;

  @Column()
  @IsOptional()
  profilePicture!: Buffer | null;

  @Column()
  homeAddress: string;

  constructor(entity: Partial<JobSeeker>) {
    super(entity);
    Object.assign(this, entity);
  }
}
