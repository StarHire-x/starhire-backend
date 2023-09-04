import { Column, Entity } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'recruiters' })
export class Recruiter extends User {
  constructor(entity: Partial<User>) {
    super(entity);
  }

  @Column()
  fullName: string;

  @Column()
  profilePictureUrl: string;
}
