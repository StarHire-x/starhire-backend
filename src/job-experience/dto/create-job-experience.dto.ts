export class CreateJobExperienceDto {
  jobSeekerId: string; //parent relationship
  jobTitle: string;
  employerName: string;
  jobDescription: string;
  startDate: Date;
  endDate: Date;
}
