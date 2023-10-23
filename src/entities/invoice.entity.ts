import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Administrator } from './administrator.entity';
import { Corporate } from './corporate.entity';
import { JobApplication } from './jobApplication.entity';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn()
  invoiceId: number;

  @Column()
  invoiceDate: Date;

  @Column()
  dueDate: Date;

  @Column()
  billingAddress: string;

  @Column()
  totalAmount: number;

  @Column()
  isPaid: boolean;

  @ManyToOne(() => Administrator, (administrator) => administrator.invoices, {
    nullable: false,
  })
  administrator: Administrator;

  @ManyToOne(() => Corporate, (corporate) => corporate.invoices, {
    nullable: false,
  })
  corporate: Corporate;

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.invoice, {
    nullable: false,
  })
  jobApplications: JobApplication[];

  // @OneToMany(() => Commission, (commission) => commission.invoice, {
  //   nullable: false,
  // })
  // commissions: Commission[];

  constructor(entity: Partial<Invoice>) {
    Object.assign(this, entity);
  }
}
