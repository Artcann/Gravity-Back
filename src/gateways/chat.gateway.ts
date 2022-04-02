import { ConsoleLogger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { time } from "console";
import { ExtractJwt } from "passport-jwt";
import { Socket } from "socket.io";
import { Chat } from "src/entities/chat.entity";
import { UserService } from "src/services/user.service";


@WebSocketGateway({
    cors: {
        origin: "*",
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(private jwtService: JwtService, private userService: UserService) {}

    handleDisconnect(client: Socket) {
        client.leave(client.id);
    }
    async handleConnection(client: Socket, ...args: any[]) {
        const socketId = client.id;
        const decodedJwt = this.jwtService.decode(client.handshake.headers.authorization);
        const userMail = decodedJwt['email'];
        const user = await this.userService.findOne(userMail);

        user.socketId = socketId;
        user.save();

        client.join(socketId);

        client.emit('session', socketId);

        return client.id;
    }
    afterInit(server: any) {
        console.log("Server up");
    }

    @SubscribeMessage('chat')
    async handleEvent(client: Socket, data: string) {
        client.emit('chat', "Bonjour")
        console.log(data);
        console.log(this.jwtService.decode(client.handshake.headers.authorization));

        const decodedJwt = this.jwtService.decode(client.handshake.headers.authorization);
        const userMail = decodedJwt['email'];
        const user = await this.userService.findOne(userMail);

        const chat = {
            content: data,
            user: user,
            isAdmin: false
        }

        const chatEntity = Chat.create(chat);
        chatEntity.save();

        return data;
    }

    @SubscribeMessage('chatAdmin')
    async handleAdminMessage(client: Socket, data: string) {
        const decodedJwt = this.jwtService.decode(client.handshake.headers.authorization);
        const userMail = decodedJwt['email'];
        const user = await this.userService.findOne(userMail);

        client.to(user.socketId).emit('chatAdmin', data);

    }

}
