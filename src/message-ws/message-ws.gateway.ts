import { WebSocketGateway } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';

@WebSocketGateway()
export class MessageWsGateway {
  constructor(private readonly messageWsService: MessageWsService) {}
}
