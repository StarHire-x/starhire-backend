import { PartialType } from '@nestjs/mapped-types';
import { CreateCommissionRateDto } from './create-commission-rate.dto';

export class UpdateCommissionRateDto extends PartialType(CreateCommissionRateDto) {}
