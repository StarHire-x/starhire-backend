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
import InvoiceStatusEnum from '../enums/invoiceStatus.enum';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn()
  invoiceId: number;

  @Column()
  invoiceDate: Date;

  @Column()
  invoiceStatus: InvoiceStatusEnum;

  @Column()
  dueDate: Date;

  @Column()
  billingAddress: string;

  @Column()
  totalAmount: number;

  @Column()
  invoiceLink: string;

  @Column()
  stripePaymentLink: string;

  @Column()
  stripeInvoiceId: string;

  @Column()
  proofOfPaymentLink: string; // only present when other payment is made

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
