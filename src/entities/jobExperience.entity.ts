import { Column, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { JobSeeker } from './jobSeeker.entity';
import { IsOptional } from 'class-validator';

@Entity({ name: 'jobExperiences' })
export class JobExperience {
  @PrimaryGeneratedColumn()
  jobExperienceId: number;

  @Column()
  jobTitle: string;

  @Column()
  jobDescription: string;

  @Column()
  employerName: string;

  @Column()
  startDate: Date;

  @Column()
  @IsOptional()
  endDate: Date;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobExperiences, {
    nullable: false,
  })
  @JoinColumn()
  jobSeeker: JobSeeker;

  constructor(entity: Partial<JobExperience>) {
    Object.assign(this, entity);
  }
}
