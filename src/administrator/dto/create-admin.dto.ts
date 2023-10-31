import UserStatusEnum from '../../enums/userStatus.enum';
import NotificationModeEnum from '../../enums/notificationMode.enum';
import { CreateTicketDto } from '../../ticket/dto/create-ticket.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateAdministratorDto extends CreateUserDto {
  fullName: string;
  profilePictureUrl: string;
}
