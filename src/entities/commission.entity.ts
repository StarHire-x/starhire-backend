import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Recruiter } from './recruiter.entity';

@Entity({ name: 'commissions' })
export class Commission {
  @PrimaryGeneratedColumn()
  commissionId: number;

  @Column()
  commissionDate: Date;

  @Column()
  commissionAmount: number;

  @OneToOne(() => Invoice, { nullable: true })
  @JoinColumn()
  invoice: Invoice;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.commissions)
  recruiter: Recruiter;

  constructor(entity: Partial<Commission>) {
    Object.assign(this, entity);
  }
}
