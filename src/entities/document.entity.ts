import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobApplication } from './jobApplication.entity';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn()
  documentId: number;

  @Column()
  documentLink: string;

  @ManyToOne(
    () => JobApplication,
    (jobApplication) => jobApplication.documents,
    { onDelete: 'CASCADE' },
  )
  jobApplication: JobApplication;

  constructor(entity: Partial<Document>) {
    Object.assign(this, entity);
  }
}
