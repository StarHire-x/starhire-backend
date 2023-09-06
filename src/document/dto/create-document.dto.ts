export class CreateDocumentDto {
    documentId: number;
    documentLink: string;
    jobApplicationId: number; //parent relationship
}
