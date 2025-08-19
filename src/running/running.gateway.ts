import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class RunningGateway
    implements OnGatewayConnection,
        OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket): any {

    }

    handleDisconnect(client: any): any {
    }
}