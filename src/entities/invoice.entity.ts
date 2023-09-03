import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(entity: Partial<Invoice>) {
    Object.assign(this, entity);
  }
}
