"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const lobby_1 = __importDefault(require("./lobby"));
const PORT = 80;
let lobby = new lobby_1.default();
let game;
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
// Create socket.io server
const io = new socket_io_1.Server();
// Setup listeners for socket.io connections
io.on('connection', (socket) => {
    socket.on("request_join", (username) => {
        if (lobby.isSpace()) {
            socket.join("lobby");
            let uid = 0; // TODO
            socket.emit("set_uid", uid);
            socket.to("lobby").emit("joined", lobby.players);
        }
    });
    socket.on("next_character", (uid) => {
    });
    socket.on("prev_character", (uid) => {
    });
});
// Start http server on the port
server.listen(PORT, () => {
    console.log("Listening on port", PORT);
});
//# sourceMappingURL=index.js.map