import UserStatusEnum from 'src/enums/userStatus.enum';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import UserRoleEnum from 'src/enums/userRole.enum';

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
