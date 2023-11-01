import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  assignedTime: Date;

  constructor(entity: Partial<JobAssignment>) {
    Object.assign(this, entity);
  }
}
