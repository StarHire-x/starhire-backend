import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'corporateTypeform' })
export class CorporateTypeform {
  @PrimaryColumn('uuid')
  responseId: string;

  @Column()
  firstName: string;

  @Column()
  email: string;

  @Column()
  schoolName: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  postalCode: string;

  @Column()
  regions: string;

  @Column()
  jobTitle: string;

  @Column()
  numberOfRoles: string; // Single choice label

  @Column()
  jobType: string;

  @Column()
  schedule: string;

  @Column()
  payRange: string;

  @Column()
  supplementalPay: string;

  @Column()
  otherBenefits: string;

  @Column()
  startDate: string;

  @Column('varchar', { length: 4000 })
  jobDescription: string;

  @Column()
  experienceRequired: string;

  @Column()
  certificationsRequired: string;

  @Column()
  typeOfWorkers: string;

  @Column()
  requiredLanguages: string;

  @Column('varchar', { length: 2000 })
  otherConsiderations: string;
}
