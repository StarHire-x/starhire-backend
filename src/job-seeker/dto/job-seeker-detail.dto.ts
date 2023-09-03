import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';

export class JobSeekerDetailDto {
  resumePdf: Buffer;
  fullName: string;
  dateOfBirth: Date;
  highestEducationStatus: HighestEducationStatusEnum;
  profilePicture: Buffer;
  homeAddress: string;
}
