import { PartialType } from '@nestjs/mapped-types';
import CommissionStatusEnum from '../../enums/commissionStatus.enum';

class UpdateDto {
  commissionDate: Date;
  commissionStatus: CommissionStatusEnum;
  commissionAmount: number;
  commissionRate: number;
  paymentDocumentURL: string;
}

export class UpdateCommissionDto extends PartialType(UpdateDto) {}
