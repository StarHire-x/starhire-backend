import { CreateUserDto } from '../../users/dto/create-user.dto';
import HighestEducationStatusEnum from '../../enums/highestEducationStatus.enum';
import { PartialType } from '@nestjs/mapped-types';
import VisibilityEnum from '../../enums/visibility.enum';

export class CreateJobSeekerDto extends PartialType(CreateUserDto) {
  resumePdf: string;
  firstName: string;
  highestEducationStatus: HighestEducationStatusEnum;
  profilePictureUrl: string;
  visibility: VisibilityEnum;
  country: string;
  description: string;
  proficientLanguages: string;
  experience: string;
  certifications: string;
  recentRole: string;
  startDate: Date;
  preferredRegions: string;
  preferredJobType: string;
  preferredSchedule: string;
  payRange: string;
  visaRequirements: string;
  ranking: string;
  otherInfo: string;
  resume: string;
  candidateNotes: string;
}
