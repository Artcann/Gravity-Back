import { ConsoleLogger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { time } from "console";
import { ExtractJwt } from "passport-jwt";
import { Socket } from "socket.io";


@WebSocketGateway({
    cors: {
        origin: "*",
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(private jwtService: JwtService) {}

    handleDisconnect(client: any) {
        console.log("Disconnection Client");
    }
    handleConnection(client: any, ...args: any[]) {
        console.log(client.id);
        let header = client.handshake.headers;
        console.log(this.jwtService.decode(header.authorization));
        return client.id;
    }
    afterInit(server: any) {
        console.log("Server up");
    }

    @SubscribeMessage('chat')
    handleEvent(client: Socket, data: string): string {
        setTimeout(() => client.emit('chat', "Bonjour"), 1000);
        console.log(data);
        console.log(this.jwtService.decode(client.handshake.headers.authorization));
        return data;
    }

}