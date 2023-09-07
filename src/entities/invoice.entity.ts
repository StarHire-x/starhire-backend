import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Commission } from './commission.entity';

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
  paid: boolean;

  @OneToMany(() => Commission, (commission) => commission.invoice, {
    nullable: false,
  })
  commissions: Commission[];

  constructor(entity: Partial<Invoice>) {
    Object.assign(this, entity);
  }
}
