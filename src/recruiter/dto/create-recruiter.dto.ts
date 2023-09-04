import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateRecruiterDto extends CreateUserDto {
  fullName: string;
  profilePictureUrl: string;
}