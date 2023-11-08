import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateCorporateDto extends PartialType(CreateUserDto) {
  companyName: string;
  companyRegistrationId: number;
  profilePictureUrl: string;
  companyAddress: string;
}
