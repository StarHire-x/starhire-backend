import { Column, Double, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommissionRate {
  @PrimaryGeneratedColumn()
  commissionRateId: number;

  @Column("float")
  commissionRate: number; //  e.g. 10% commission rate will be stored as 10

  constructor(entity: Partial<CommissionRate>) {
    Object.assign(this, entity);
  }
}
