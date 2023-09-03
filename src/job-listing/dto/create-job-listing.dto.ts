import { JobApplication } from "src/entities/jobApplication.entity";
import JobListingStatusEnum from "src/enums/jobListingStatus.enum";

export class CreateJobListingDto {
    jobListingId: number;
    title: string;
    description: string;
    jobLocation: string;
    listingDate: Date;
    averageSalary: number;
    jobStartDate: Date;
    jobListingStatus: JobListingStatusEnum;
}
