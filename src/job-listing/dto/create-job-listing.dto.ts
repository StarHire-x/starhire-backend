import JobListingStatusEnum from "src/enums/jobListingStatus.enum";
import { CreateJobApplicationDto } from "src/job-application/dto/create-job-application.dto";

export class CreateJobListingDto {
    jobListingId: number;
    title: string;
    description: string;
    jobLocation: string;
    listingDate: Date;
    averageSalary: number;
    jobStartDate: Date;
    jobListingStatus: JobListingStatusEnum;
    jobApplications: CreateJobApplicationDto[];
}
