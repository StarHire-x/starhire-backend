import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Commission } from './commission.entity';
import { JobApplication } from './jobApplication.entity';

@Entity({ name: 'recruiters' })
export class Recruiter extends User {
  constructor(entity: Partial<User>) {
    super(entity);
  }

  @Column()
  fullName: string;

  @Column()
  profilePictureUrl: string;

  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.recruiter,
    { nullable: true },
  )
  jobApplications: JobApplication[] = [];

  @OneToMany(() => Commission, (commission) => commission.recruiter, {
    cascade: true,
  })
  commissions: Commission[];
}
