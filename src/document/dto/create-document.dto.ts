export class CreateDocumentDto {
  documentLink: string;
  documentName: string;
  jobApplicationId: number; //parent relationship
}
