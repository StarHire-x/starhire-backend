import { PartialType } from '@nestjs/mapped-types';
import { CreateCommissionDto } from '../../commission/dto/create-commission.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateRecruiterDto extends PartialType(CreateUserDto) {
  fullName: string;
  profilePictureUrl: string;
}
