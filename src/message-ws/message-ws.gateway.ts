import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDTO } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    console.log({ payload });
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  /* @SubscribeMessage() es un decorador utilizado en Nest.js en conjunción con WebSockets para
  definir manejadores de eventos para mensajes específicos en el servidor. */
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDTO) {
    //! Este emite a solo el cliente actual
    /* client.emit('message-from-client', {
      fullName: 'Soy Yo!',
      message: payload.message || 'Without message.',
    }); */
    //! Este emite a todos menos al cliente actual con la opción broadcast
    /* client.broadcast.emit('message-from-client', {
      fullName: 'Soy Yo!',
      message: payload.message || 'Without message.',
    }); */

    //! Este emite a todos incluyendo al cliente actual
    this.wss.emit('message-from-client', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'Without message.',
    });
  }
}
