"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = __importDefault(require("websocket"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const PORT = 80;
let server = http_1.default.createServer((req, res) => {
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
server.listen(PORT, () => {
    console.log("Listening on port", PORT);
});
let wsServer = new websocket_1.default.server({
    httpServer: server,
});
wsServer.on('request', (request) => {
    let connection = request.accept(null, request.origin);
    connection.on('message', (message) => {
        console.log(JSON.parse(message.utf8Data));
    });
    connection.on('close', (connection) => {
        console.log("Closed:", connection);
    });
});
//# sourceMappingURL=index.js.map