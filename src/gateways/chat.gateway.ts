import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "dgram";

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
        return client.id;
    }
    afterInit(server: any) {
        console.log("Server up");
    }

    @SubscribeMessage('chat')
    handleEvent(client: Socket, data: string): string {
        console.log(data);
        return data;
    }

}