import { CreateChatMessageDto } from "src/chat-message/dto/create-chat-message.dto";

export class CreateChatDto {
    chatId: number;
    lastUpdatedAt: Date;
    chatMessages: CreateChatMessageDto[];
}
