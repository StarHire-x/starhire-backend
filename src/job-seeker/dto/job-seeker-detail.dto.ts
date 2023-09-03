import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';

export class JobSeekerDetailDto {
  resumePdf: Blob;
  fullName: string;
  dateOfBirth: Date;
  highestEducationStatus: HighestEducationStatusEnum;
  profilePicture: Blob;
  homeAddress: string;
}
