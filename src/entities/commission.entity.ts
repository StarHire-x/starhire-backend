import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

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

  constructor(entity: Partial<Commission>) {
    Object.assign(this, entity);
  }
}
