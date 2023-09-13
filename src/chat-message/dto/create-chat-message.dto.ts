export class CreateChatMessageDto {
  message: string;
  timestamp: Date;
  chatId: number;
  isImportant: boolean;
  userId: number;
  fileURL: string;
}
