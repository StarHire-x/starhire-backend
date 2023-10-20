import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobApplication } from './jobApplication.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn()
  documentId: number;

  @Column()
  documentName: string;

  @Column()
  documentLink: string;

  @Column()
  mandatory: boolean;

  @ManyToOne(
    () => JobApplication,
    (jobApplication) => jobApplication.documents,
    { nullable: true },
  )
  jobApplication: JobApplication;

  @ManyToOne(() => Ticket, (ticket) => ticket.documents, { nullable: true })
  ticket: Ticket;

  constructor(entity: Partial<Document>) {
    Object.assign(this, entity);
  }
}
