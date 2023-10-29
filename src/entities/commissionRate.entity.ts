import { Column, Double, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommissionRate {
  @PrimaryGeneratedColumn()
  commissionRateId: number;

  @Column({type: 'decimal', precision: 2, scale: 2})
  commissionRate: number; // in the form of decimal, e.g. 10% commission rate will be stored as 0.1

  constructor(entity: Partial<CommissionRate>) {
    Object.assign(this, entity);
  }
}
