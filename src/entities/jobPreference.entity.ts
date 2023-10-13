import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { JobSeeker } from './jobSeeker.entity';
import { Corporate } from './corporate.entity';

@Entity({ name: 'jobPreferences' })
export class JobPreference {
  @PrimaryGeneratedColumn()
  jobPreferenceId: number;

  @Column()
  benefitPreference: number;

  @Column()
  salaryPreference: number;

  @Column()
  workLifeBalancePreference: number;

  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobPreference)
  @JoinColumn()
  jobSeeker: JobSeeker;

  @OneToOne(() => Corporate, (corporate) => corporate.jobPreference)
  @JoinColumn()
  corporate: Corporate;

  constructor(entity: Partial<JobPreference>) {
    Object.assign(this, entity);
  }
}
