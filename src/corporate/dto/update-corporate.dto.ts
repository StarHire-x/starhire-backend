import { PartialType } from '@nestjs/mapped-types';
import { CreateCorporateDto } from './create-corporate.dto';

export class UpdateCorporateDto extends PartialType(CreateCorporateDto) {}
