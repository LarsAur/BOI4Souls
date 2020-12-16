import { stringify } from 'querystring';
import { ICloseEvent, IMessageEvent, w3cwebsocket as WebSocket } from 'websocket';

const webSocketAddress = "ws://84.210.222.184:80";

let connection: WebSocket;

export default class Network{

    static connection: WebSocket;

    static connect = () => {
        if(connection) return;

        // Create connection
        connection = new WebSocket(webSocketAddress);
        
        // Register onopen listener
        connection.onopen = Network.onOpen;
        // Register message listener
        connection.onmessage = Network.onMessage;
        // Register 
        connection.onclose = Network.onClose;
    }

    static sendJoinRequest(username: string){
        Network.send("request_join", {username: username})
    }

    private static send(action: string, data:any){
        connection.send(JSON.stringify({action: action, data: data}));
    }

    private static onOpen = () => {
        console.log("Websocket opened and connected to:", webSocketAddress);
    }

    private static onClose = (event: ICloseEvent) => {
        console.log("Websocket connection was closed: " + event.reason);
    }

    private static onMessage = (message: IMessageEvent) => {
        console.log(message.data);
    }
}
