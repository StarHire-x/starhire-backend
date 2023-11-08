import UserStatusEnum from '../../enums/userStatus.enum';
import NotificationModeEnum from '../../enums/notificationMode.enum';

export class AdministratorDetailDto {
  userName: string;
  email: string;
  password: string;
  contactNo: string;
  status: UserStatusEnum;
  notificationMode: NotificationModeEnum;
  createdAt: Date;
}
