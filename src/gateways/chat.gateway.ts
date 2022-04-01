import { ConsoleLogger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { ExtractJwt } from "passport-jwt";
import { Socket } from "socket.io";


@WebSocketGateway({
    cors: {
        origin: "*",
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    handleDisconnect(client: any) {
        console.log("Disconnection Client");
    }
    handleConnection(client: any, ...args: any[]) {
        console.log(client.id);
        let header = client.handshake.headers;
        console.log(header);
        console.log(ExtractJwt.fromBodyField(header));
        return client.id;
    }
    afterInit(server: any) {
        console.log("Server up");
    }

    @SubscribeMessage('chat')
    handleEvent(client: Socket, data: string): string {
        client.emit('chat', "Bonjour");
        console.log(data);
        console.log(client.handshake.headers);
        return data;
    }

}