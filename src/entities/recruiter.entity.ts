import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Commission } from './commission.entity';

@Entity({ name: 'recruiters' })
export class Recruiter extends User {
  constructor(entity: Partial<User>) {
    super(entity);
  }

  @Column()
  fullName: string;

  @Column()
  profilePictureUrl: string;

  @OneToMany(() => Commission, (commission) => commission.recruiter, {
    cascade: true,
  })
  commissions: Commission[];
}
