import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobApplication } from './jobApplication.entity';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn()
  documentId: number;

  @Column()
  documentName: string;

  @Column()
  documentLink: string;

  @ManyToOne(
    () => JobApplication,
    (jobApplication) => jobApplication.documents,
    { nullable: false },
  )
  jobApplication: JobApplication;

  constructor(entity: Partial<Document>) {
    Object.assign(this, entity);
  }
}
