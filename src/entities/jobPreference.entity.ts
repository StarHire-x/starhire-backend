import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

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

  constructor(entity: Partial<JobPreference>) {
    Object.assign(this, entity);
  }
}
