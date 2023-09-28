import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'jobAssignment' })
export class JobAssignment {

  @PrimaryGeneratedColumn()
  jobAssignmentId: number;

  @Column()
  jobSeekerId: string;

  @Column()
  jobListingId: number;

  @Column()
  recruiterId: string;

  // constructor(entity: Partial<JobAssignment>) {
  //   Object.assign(this, entity);
  // }
}
