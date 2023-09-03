import { PartialType } from '@nestjs/mapped-types';
import { CreateAdministratorDto } from './create-admin.dto';

export class UpdateAdministratorDto extends PartialType(CreateAdministratorDto) {}
