import UserStatusEnum from "src/enums/userStatus.enum";
import NotificationModeEnum from "src/enums/notificationMode.enum";
import { CreateTicketDto } from "src/ticket/dto/create-ticket.dto";

export class AdministratorDetailDto {
  userName: string;
  email: string;
  password: string;
  contactNo: string;
  status: UserStatusEnum;
  notificationMode: NotificationModeEnum;
  createdAt: Date;
  tickets: CreateTicketDto[];
}
