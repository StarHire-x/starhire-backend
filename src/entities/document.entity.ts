import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobApplication } from './jobApplication.entity';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentLink: string;

  @ManyToOne(
    () => JobApplication,
    (jobApplication) => jobApplication.documents,
    { onDelete: 'SET NULL' },
  )
  jobApplication: JobApplication;
}
