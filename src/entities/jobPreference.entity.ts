import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class JobPreference {
  @PrimaryGeneratedColumn()
  jobPreferenceId: number;

  @Column()
  locationPreference: Number;

  @Column()
  salaryPreference: Number;

  @Column()
  culturePreference: Number;

  @Column()
  diversityPreference: Number;

  @Column()
  workLifeBalancePreference: Number;

  constructor(entity: Partial<JobPreference>) {
    Object.assign(this, entity);
  }
}
