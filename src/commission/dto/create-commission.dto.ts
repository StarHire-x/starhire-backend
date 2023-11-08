import CommissionStatusEnum from '../../enums/commissionStatus.enum';

export class CreateCommissionDto {
  commissionDate: Date;
  // commissionStatus: CommissionStatusEnum;
  commissionRate: number;
  commissionAmount: number;
  paymentDocumentURL: string;
  // Parent entities
  jobApplicationIds: number[];
  recruiterId: string;
  administratorId: string;
}
