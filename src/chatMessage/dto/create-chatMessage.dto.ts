import { ChatDto } from 'src/chat/dto/create-chat.dto';

export class ChatMessageDto {
  chatMessageId: number;
  message: string;
  timestamp: Date;
  chat: ChatDto; // This should typically be another DTO representing the Chat entity
}
