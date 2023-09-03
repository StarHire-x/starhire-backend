import { IsEnum } from 'class-validator';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Document } from './document.entity';

@Entity({ name: 'jobApplications' })
export class JobApplication {
  @PrimaryGeneratedColumn()
  jobApplicationId: number;

  @IsEnum(JobApplicationStatusEnum)
  jobApplicationStatus: JobApplicationStatusEnum;

  @Column()
  availableStartDate: Date;

  @Column({ nullable: true })
  availableEndDate: Date;

  @OneToMany(() => Document, (document) => document.jobApplication)
  documents: Document[];

  @Column({ nullable: true })
  submissionDate: Date;
}
