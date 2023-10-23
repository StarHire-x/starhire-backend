export class CreateCommissionDto {
  commissionDate: Date;
  commissionAmount: number;
  // Parent entities
  jobApplicationIds: number[];
  recruiterId: string;
}
