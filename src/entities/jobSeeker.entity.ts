import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from './user.entity';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';
import { IsEnum } from 'class-validator';

@Entity({ name: 'jobSeekers' })
export class JobSeeker extends User {
  @Column()
  resumePdf: Blob;

  @Column()
  fullName: string;

  @Column()
  dateOfBirth: Date;

  @IsEnum(HighestEducationStatusEnum)
  highestEducationStatus: HighestEducationStatusEnum;

  @Column()
  profilePicture: Blob;

  @Column()
  homeAddress: string;

  constructor(entity: Partial<JobSeeker>) {
    super(entity);
    Object.assign(this, entity);
  }
}
