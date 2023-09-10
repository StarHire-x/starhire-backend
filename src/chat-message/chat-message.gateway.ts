import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from 'src/chat-message/dto/create-chat-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatMessageGateWay
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatMessageService: ChatMessageService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: CreateChatMessageDto,
  ): Promise<void> {
    console.log(payload);
    this.server.emit(`${payload.chatId}`, payload);
    await this.chatMessageService.createMessage(payload);
  }

  afterInit(server: Server) {
    console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Do stuffs
  }
}
