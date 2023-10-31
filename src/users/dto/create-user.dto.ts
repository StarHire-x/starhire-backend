import UserStatusEnum from '../../enums/userStatus.enum';
import NotificationModeEnum from '../../enums/notificationMode.enum';
import UserRoleEnum from '../../enums/userRole.enum';

export class CreateUserDto {
  // userId: number;
  userName: string;
  email: string;
  password: string;
  contactNo: string;
  status: UserStatusEnum;
  notificationMode: NotificationModeEnum;
  createdAt: Date;
  role: UserRoleEnum;
}
