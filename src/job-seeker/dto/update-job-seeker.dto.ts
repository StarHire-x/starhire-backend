import { CreateJobSeekerDto } from './create-job-seeker.dto';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';
import { PartialType } from '@nestjs/mapped-types';

// class UpdateDto {
//   resumePdf: string;
//   fullName: string;
//   dateOfBirth: Date;
//   highestEducationStatus: HighestEducationStatusEnum;
//   profilePictureUrl: string;
//   homeAddress: string;
//   instituteName: string;
//   dateOfGraduation: Date;
//   jobListings: [];
//   status: 
// }

export class UpdateJobSeekerDto extends PartialType(CreateJobSeekerDto) {}
