import UserStatusEnum from "src/enums/userStatus.enum";
import NotificationModeEnum from "src/enums/notificationMode.enum";
import { EventListing } from "src/entities/eventListing.entity";

export class CorporateDetailDto {
  userName: string;
  email: string;
  password: string;
  contactNo: string;
  status: UserStatusEnum;
  notificationMode: NotificationModeEnum;
  createdAt: Date;
  companyName: string;
  companyRegistrationId: number;
  corporatePicture: string;
  companyAddress: string;
  eventListings: EventListing[];
}