import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
    cors: {
        origin: "*",
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    handleDisconnect(client: any) {
        throw new Error("Method not implemented.");
    }
    handleConnection(client: any, ...args: any[]) {
        console.log(client);
    }
    afterInit(server: any) {
        throw new Error("Method not implemented.");
    }

}