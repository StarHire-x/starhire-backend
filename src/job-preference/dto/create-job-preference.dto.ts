import { CreateJobSeekerDto } from "src/job-seeker/dto/create-job-seeker.dto";

export class CreateJobPreferenceDto {
  locationPreference: number;
  salaryPreference: number;
  culturePreference: number;
  diversityPreference: number;
  workLifeBalancePreference: number;
  jobSeeker: CreateJobSeekerDto;
}
