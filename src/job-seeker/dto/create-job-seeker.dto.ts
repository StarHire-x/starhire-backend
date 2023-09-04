import { CreateUserDto } from 'src/users/dto/create-user.dto';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';

export class CreateJobSeekerDto extends CreateUserDto {
  resumePdf: string;
  fullName: string;
  dateOfBirth: Date;
  highestEducationStatus: HighestEducationStatusEnum;
  profilePictureUrl: string;
  homeAddress: string;
}
