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

    static onOpen = () => {
        console.log("Websocket opened and connected to:", webSocketAddress);
        connection.send(JSON.stringify({data: 1}))

        console.log(JSON.stringify({data: 1}))
    }

    static onClose = (event: ICloseEvent) => {
        console.log("Websocket connection was closed: " + event.reason);
    }

    static onMessage = (message: IMessageEvent) => {
        console.log(message.data);
    }
}
