import { PartialType } from '@nestjs/mapped-types';
import CommissionStatusEnum from 'src/enums/commissionStatus.enum';

class UpdateDto {
  commissionDate: Date;
  commissionStatus: CommissionStatusEnum;
  commissionAmount: number;
}

export class UpdateCommissionDto extends PartialType(UpdateDto) {}
