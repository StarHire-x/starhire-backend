import { CreateUserDto } from '../../users/dto/create-user.dto';
import HighestEducationStatusEnum from '../../enums/highestEducationStatus.enum';
import { PartialType } from '@nestjs/mapped-types';
import VisibilityEnum from '../../enums/visibility.enum';

export class CreateJobSeekerDto extends PartialType(CreateUserDto) {
  resumePdf: string;
  fullName: string;
  dateOfBirth: Date;
  highestEducationStatus: HighestEducationStatusEnum;
  profilePictureUrl: string;
  homeAddress: string;
  instituteName: string;
  dateOfGraduation: Date;
  visibility: VisibilityEnum;
}
