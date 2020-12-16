"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = __importDefault(require("websocket"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const PORT = 80;
// Setup http server and the endpoints
const server = http_1.default.createServer((req, res) => {
    console.log(new Date() + ' Received request for ' + req.url);
    let endpoint = req.url;
    if (endpoint.endsWith("/"))
        endpoint += "index.html";
    fs_1.default.readFile("../client/build/" + endpoint, (err, data) => {
        if (err) {
            console.log("Error while responding to:", endpoint);
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});
// Start http server on the port
server.listen(PORT, () => {
    console.log("Listening on port", PORT);
});
// Create websocket server
const wsServer = new websocket_1.default.server({
    httpServer: server,
});
// Setup listeners for 
wsServer.on('request', (request) => {
    let connection = request.accept(null, request.origin);
    connection.on('message', onMessage);
    connection.on('close', onClose);
});
const onMessage = (message) => {
    const messageObj = JSON.parse(message.utf8Data);
    switch (messageObj.action) {
        case "request_join":
            onJoinRequest(messageObj.data.username);
            break;
        default:
            console.log("Uncaught message action:", messageObj);
    }
};
const onJoinRequest = (username) => {
    console.log(username, "requested to join");
};
const onClose = (connectionId) => {
    console.log("Connection closed", connectionId);
};
//# sourceMappingURL=index.js.map