import CommissionStatusEnum from 'src/enums/commissionStatus.enum';

export class CreateCommissionDto {
  commissionDate: Date;
  // commissionStatus: CommissionStatusEnum;
  commissionAmount: number;
  // Parent entities
  jobApplicationIds: number[];
  recruiterId: string;
  administratorId: string;
}
