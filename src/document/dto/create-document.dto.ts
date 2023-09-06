import { CreateJobApplicationDto } from "src/job-application/dto/create-job-application.dto";

export class CreateDocumentDto {
    documentId: number;
    documentLink: string;
    jobApplication: CreateJobApplicationDto;
}
