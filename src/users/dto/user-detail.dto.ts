import UserStatusEnum from '../../enums/userStatus.enum';
import NotificationModeEnum from '../../enums/notificationMode.enum';
import UserRoleEnum from '../../enums/userRole.enum';
import { CreateTicketDto } from '../../ticket/dto/create-ticket.dto';

export class UserDetailDto {
  userName: string;
  email: string;
  password: string;
  contactNo: string;
  status: UserStatusEnum;
  notificationMode: NotificationModeEnum;
  createdAt: Date;
  role: UserRoleEnum;
  tickets: CreateTicketDto;
}
