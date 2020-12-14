import WebSocketServer, { IMessage } from 'websocket'
import http from 'http'
import fs from 'fs';

const PORT = 80;

let server = http.createServer((req, res) => {
    console.log(new Date() + ' Received request for ' + req.url);

    let endpoint = req.url;
    if(endpoint.endsWith("/")) endpoint += "index.html"


    fs.readFile("../client/build/" + endpoint, (err, data) => {
        if(err){
            console.log("Error while responding to:", endpoint)
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }

        res.writeHead(200);
        res.end(data);
    })

});

server.listen(PORT, () => {
    console.log("Listening on port", PORT)
});

let wsServer = new WebSocketServer.server({
    httpServer: server,
})

wsServer.on('request', (request) => {
    let connection = request.accept(null, request.origin);

    connection.on('message', (message:IMessage) => {
        console.log(JSON.parse(message.utf8Data));
    });

    connection.on('close', (connection) => {
        console.log("Closed:", connection)
    });
})