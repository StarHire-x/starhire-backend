import { CreateJobSeekerDto } from "src/job-seeker/dto/create-job-seeker.dto";

export class CreateJobPreferenceDto {
  jobSeekerId: number; //parent relationship
  locationPreference: number;
  salaryPreference: number;
  culturePreference: number;
  diversityPreference: number;
  workLifeBalancePreference: number;
}
