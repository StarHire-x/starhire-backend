import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { JobSeeker } from './jobSeeker.entity';

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
  endDate: Date;

  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobExperience)
  @JoinColumn()
  jobSeeker: JobSeeker;

  constructor(entity: Partial<JobExperience>) {
    Object.assign(this, entity);
  }
}
