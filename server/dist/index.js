"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const lobby_1 = __importDefault(require("./lobby"));
const game_1 = __importDefault(require("./game"));
const PORT = 80;
let lobby = new lobby_1.default();
let game;
let socketToUid = new Map();
// Setup http server and the endpoints
const server = http_1.default.createServer((req, res) => {
    console.log(new Date() + ' Received request for ' + req.url);
    if (req.url.startsWith("/socket.io"))
        return;
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
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});
// Setup listeners for socket.io connections
io.on('connection', (socket) => {
    console.log("Connected...");
    socket.on("request_join", (username) => {
        console.log(lobby.isSpace());
        if (lobby.isSpace()) {
            socket.join("lobby");
            let uid = lobby.addPlayer(username);
            socketToUid.set(socket, uid);
            socket.emit("accept_join", uid);
            // Send to all members of the lobby
            io.to("lobby").emit("update_lobby", lobby.getPlayers());
        }
    });
    socket.on("next_character", (uid) => {
        lobby.incrementPlayerCharacter(uid);
        io.to("lobby").emit("update_lobby", lobby.getPlayers());
    });
    socket.on("prev_character", (uid) => {
        lobby.decrementPlayerCharacter(uid);
        io.to("lobby").emit("update_lobby", lobby.getPlayers());
    });
    socket.on("start_game_request", () => {
        console.log("Game start request");
        game = new game_1.default(lobby.players);
        console.log(game.getGameData());
        io.to("lobby").emit("start_game", game.getGameData());
    });
    socket.on("roll_dice_request", () => {
        let value = Math.ceil(Math.random() * 6);
        while (value === 0) {
            value = Math.ceil(Math.random() * 6);
        }
        console.log("Dice rolled:", value);
        io.to("lobby").emit("roll_dice", value);
    });
    socket.on("new_game_data_request", (gameData) => {
        io.to("lobby").emit("new_game_data", gameData);
    });
    socket.on("disconnect", (reason) => {
        let uid = socketToUid.get(socket);
        if (uid !== undefined) {
            console.log(lobby.getPlayer(uid).username, "left...");
            console.log("Lobby:", lobby.getPlayers());
            lobby.removePlayer(uid);
            io.to("lobby").emit("update_lobby", lobby.getPlayers());
        }
    });
});
// Start http server on the port
server.listen(PORT, () => {
    console.log("Listening on port", PORT);
});
//# sourceMappingURL=index.js.map