import WebSocketServer, { IMessage } from 'websocket'
import http from 'http'
import fs from 'fs';

const PORT = 80;

// Setup http server and the endpoints
const server = http.createServer((req, res) => {
    console.log(new Date() + ' Received request for ' + req.url);

    let endpoint = req.url;
    if (endpoint.endsWith("/")) endpoint += "index.html"


    fs.readFile("../client/build/" + endpoint, (err, data) => {
        if (err) {
            console.log("Error while responding to:", endpoint)
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }

        res.writeHead(200);
        res.end(data);
    })

});

// Start http server on the port
server.listen(PORT, () => {
    console.log("Listening on port", PORT)
});

// Create websocket server
const wsServer = new WebSocketServer.server({
    httpServer: server,
})

// Setup listeners for 
wsServer.on('request', (request: WebSocketServer.request) => {
    let connection = request.accept(null, request.origin);
    connection.on('message', onMessage);
    connection.on('close', onClose);
})

interface IMessageObject{
    action: string
    data: any
}

const onMessage = (message: IMessage) => {
    const messageObj : IMessageObject = JSON.parse(message.utf8Data);

    switch(messageObj.action){
        case "request_join":
            onJoinRequest(messageObj.data.username)
            break;
        default:
            console.log("Uncaught message action:", messageObj)
    }
};

const onJoinRequest = (username: string) => {
    console.log(username, "requested to join")
}

const onClose = (connectionId: number) => {
    console.log("Connection closed", connectionId);
}

