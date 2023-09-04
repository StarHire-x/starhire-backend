import UserStatusEnum from "src/enums/userStatus.enum";
import NotificationModeEnum from "src/enums/notificationMode.enum";
import { CreateTicketDto } from "src/ticket/dto/create-ticket.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateAdministratorDto extends CreateUserDto {
  tickets: CreateTicketDto[];
}
