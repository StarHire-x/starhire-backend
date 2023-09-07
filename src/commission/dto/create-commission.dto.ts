export class CreateCommissionDto {
  commissionDate: Date;
  commissionAmount: number;
  // Parent entities
  jobApplicationId: number;
  recruiterId: number;
}
