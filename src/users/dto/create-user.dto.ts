import UserStatusEnum from "src/enums/userStatus.enum";
import NotificationModeEnum from "src/enums/notificationMode.enum";

export class CreateUserDto {
  userName: string;
  email: string;
  password: string;
  contactNo: string;
  status: UserStatusEnum;
  notificationMode: NotificationModeEnum;
  createdAt: Date;
}
