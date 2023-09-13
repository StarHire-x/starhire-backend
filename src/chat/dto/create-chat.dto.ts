import { CreateChatMessageDto } from 'src/chat-message/dto/create-chat-message.dto';

export class CreateChatDto {
  lastUpdatedAt: Date;
  jobSeekerId: number;
  corporateId: number;
  recruiterId: number;
}
