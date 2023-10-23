import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobApplication } from './jobApplication.entity';
import { Recruiter } from './recruiter.entity';
import { Administrator } from './administrator.entity';

@Entity({ name: 'commissions' })
export class Commission {
  @PrimaryGeneratedColumn()
  commissionId: number;

  @Column()
  commissionDate: Date;

  @Column()
  commissionAmount: number;

  // @OneToOne(() => Invoice, { nullable: true })
  // @JoinColumn()
  // invoice: Invoice;

  @ManyToOne(
    () => Administrator,
    (administrator) => administrator.commissions,
    {
      nullable: true,
    },
  )
  administrator: Administrator;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.commissions, {
    nullable: false,
  })
  recruiter: Recruiter;

  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.commission,
    {
      nullable: false,
    },
  )
  jobApplications: JobApplication[];

  constructor(entity: Partial<Commission>) {
    Object.assign(this, entity);
  }
}
