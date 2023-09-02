import { Controller } from '@nestjs/common';
import { ChatMessageService } from './chatMessage.service';

@Controller()
export class ChatMessageController {
  constructor(private readonly chatService: ChatMessageService) {}
}
