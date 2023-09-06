import { EventListing } from "src/entities/eventListing.entity";
import { JobListing } from "src/entities/jobListing.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateCorporateDto extends CreateUserDto {
  companyName: string;
  companyRegistrationId: number;
  corporatePicture: string;
  companyAddress: string;
  eventListings: EventListing[];
  jobListings: JobListing[];
}
