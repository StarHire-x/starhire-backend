import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { JobSeeker } from './jobSeeker.entity';

@Entity({ name: 'jobPreferences' })
export class JobPreference {
  @PrimaryGeneratedColumn()
  jobPreferenceId: number;

  @Column()
  locationPreference: number;

  @Column()
  salaryPreference: number;

  @Column()
  culturePreference: number;

  @Column()
  diversityPreference: number;

  @Column()
  workLifeBalancePreference: number;

  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobPreference)
  @JoinColumn()
  jobSeeker: JobSeeker;

  constructor(entity: Partial<JobPreference>) {
    Object.assign(this, entity);
  }
}
