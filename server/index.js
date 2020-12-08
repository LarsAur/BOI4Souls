const WebSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs'); 

const PORT = 80;

let server = http.createServer((req, res) => {
    console.log(new Date() + ' Received request for ' + req.url);

    fs.readFile("../client/build" + endpoint, (err, data) => {
        if(err){
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

wsServer = new WebSocketServer({
    httpServer: server,
})

wsServer.on('request', (request) => {
    let connection = request.accept(null, request.origin);

    connection.on('message', (message) => {
        if(message.type === 'utf8'){

        }
    });

    connection.on('close', (connection) => {
        console.log(connection)
    });
})