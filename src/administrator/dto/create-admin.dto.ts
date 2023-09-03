import UserStatusEnum from "src/enums/userStatus.enum";
import NotificationModeEnum from "src/enums/notificationMode.enum";

export class CreateAdministratorDto {
  userName: string;
  email: string;
  password: string;
  contactNo: string;
  status: UserStatusEnum;
  notificationMode: NotificationModeEnum;
  createdAt: Date;
}
