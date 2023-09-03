import { PartialType } from '@nestjs/mapped-types';
import { CreateCommissionDto } from './create-commission.dto';

export class UpdateCommissionDto extends PartialType(CreateCommissionDto) {}
