import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: { socket: Socket; user: User };
}

@Injectable()
export class MessageWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userID: string) {
    const user = await this.userRepository.findOneBy({ id: userID });
    if (!user) throw new Error('User no found');
    if (!user.isActive) throw new Error('User is not active');
    this.checkOutUserConnection(user);
    this.connectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientID: string) {
    delete this.connectedClients[clientID];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketID: string): string {
    return this.connectedClients[socketID].user.fullName;
  }

  async checkOutUserConnection(user: User) {
    for (const clientID of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientID];
      if (connectedClient.user?.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
