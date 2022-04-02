import { ConsoleLogger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { time } from 'console';
import { ExtractJwt } from 'passport-jwt';
import { Socket, Server } from 'socket.io';
import { Chat } from 'src/entities/chat.entity';
import { UserService } from 'src/services/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @WebSocketServer() wss: Server;
  
  handleDisconnect(client: Socket) {
    client.leave(client.id);
  }
  async handleConnection(client: Socket, ...args: any[]) {
    const socketId = client.id;
    const decodedJwt = this.jwtService.decode(
      client.handshake.headers.authorization,
    );
    const userMail = decodedJwt['email'];
    const user = await this.userService.findOne(userMail);

    user.socketId = socketId;
    user.save();

    client.join(socketId);
    //client.emit('session', socketId);
    return client.id;
  }
  afterInit(server: any) {
    console.log('Server up');
  }

  @SubscribeMessage('chat')
  async handleEvent(client: Socket, data: string) {
  
    const decodedJwt = this.jwtService.decode(
      client.handshake.headers.authorization,
    );
    const userMail = decodedJwt['email'];
    const user = await this.userService.findOne(userMail);

    const chat = {
      content: data,
      user: user,
      isAdmin: false,
      date: new Date(),
    };

    const chatEntity = Chat.create(chat);
    chatEntity.save();
    //console.log("sending", data, "to room chat to user with socketId :", user.socketId)
    //console.log("actual socket id : ", client.id)

    //client.to(client.id).emit('chat', data);
    client.emit('chat', 'Message 1 : ' + data);
    this.wss.to(client.id).emit('chat', 'Message 2 : ' + data);
    this.wss.to(user.socketId).emit('chat', 'Message 3 : ' + data);

    console.log(data , "|", client.id, "|", user.socketId);
    console.log(this.jwtService.decode(client.handshake.headers.authorization));

    return data;
  }

  @SubscribeMessage('chatAdmin')
  async handleAdminMessage(client: Socket, data: string) {
    const decodedJwt = this.jwtService.decode(
      client.handshake.headers.authorization,
    );
    const userMail = decodedJwt['email'];
    const user = await this.userService.findOne(userMail);

    const chat = {
      content: data,
      user: user,
      isAdmin: true,
      date: new Date(),
    };

    const chatEntity = Chat.create(chat);
    chatEntity.save();

    client.to(user.socketId).emit('chatAdmin', data);
  }
}
