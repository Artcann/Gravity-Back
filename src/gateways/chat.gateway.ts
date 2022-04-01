import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "dgram";

@WebSocketGateway({
    cors: {
        origin: "*",
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    handleDisconnect(client: any) {
        console.log("Disconnection Client: ", client);
    }
    handleConnection(client: any, ...args: any[]) {
        console.log(client);
    }
    afterInit(server: any) {
        console.log("Server up");
    }

    @SubscribeMessage('events')
    handleEvent(client: Socket, data: string): string {
        console.log(client);
        return data;
    }

}