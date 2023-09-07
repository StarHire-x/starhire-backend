import { PartialType } from '@nestjs/mapped-types';

class UpdateDto {
  commissionDate: Date;
  commissionAmount: number;
}

export class UpdateCommissionDto extends PartialType(UpdateDto) {}
