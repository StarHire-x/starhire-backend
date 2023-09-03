import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'commissions' })
export class Commission {
  @PrimaryGeneratedColumn()
  commissionId: number;

  @Column()
  commissionDate: Date;

  @Column()
  commissionAmount: number;

  constructor(entity: Partial<Commission>) {
    Object.assign(this, entity);
  }
}
