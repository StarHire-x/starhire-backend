import { CreateUserDto } from 'src/users/dto/create-user.dto';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';
import { PartialType } from '@nestjs/mapped-types';
import VisibilityEnum from 'src/enums/visibility.enum';

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
