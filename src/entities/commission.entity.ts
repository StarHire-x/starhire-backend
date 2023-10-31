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
import CommissionStatusEnum from 'src/enums/commissionStatus.enum';

@Entity({ name: 'commissions' })
export class Commission {
  @PrimaryGeneratedColumn()
  commissionId: number;

  @Column()
  commissionDate: Date;

  @Column()
  commissionStatus: CommissionStatusEnum;

  @Column('float')
  commissionRate: number; //  e.g. 10% commission rate will be stored as 10

  @Column()
  commissionAmount: number;

  @Column()
  paymentDocumentURL: string;

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
