import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'jobseekerTypeform' })
export class JobseekerTypeform {
  @PrimaryColumn('uuid')
  responseId: string;

  @Column()
  firstName: string;

  @Column()
  email: string;

  @Column()
  country: string;

  @Column()
  description: string;

  @Column()
  proficientLanguages: string;

  @Column()
  experience: string;

  @Column()
  certifications: string;

  @Column()
  recentRole: string;

  @Column()
  resume: string;

  @Column()
  startDate: string;

  @Column()
  preferredRegions: string;

  @Column()
  preferredJobType: string;

  @Column()
  preferredSchedule: string;

  @Column()
  payRange: string;

  @Column()
  visaRequirements: string;

  @Column()
  ranking: string;

  @Column('varchar', { length: 2000 })
  otherInfo: string;
}
