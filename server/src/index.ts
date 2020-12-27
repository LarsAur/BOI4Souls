import { Server, Socket } from 'socket.io'
import http from 'http'
import fs from 'fs';

import BOILobby from './lobby';
import BOIGame, { IGameData } from './game';

const PORT = 80;

let lobby = new BOILobby();
let game;
let socketToUid = new Map<Socket, number>();

// Setup http server and the endpoints
const server = http.createServer((req, res) => {
    console.log(new Date() + ' Received request for ' + req.url);

    if (req.url.startsWith("/socket.io")) return;
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

// Create socket.io server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Setup listeners for socket.io connections
io.on('connection', (socket: Socket) => {

    console.log("Connected...")

    socket.on("request_join", (username: string) => {

        console.log(lobby.isSpace())

        if (lobby.isSpace()) {
            socket.join("lobby");
            let uid = lobby.addPlayer(username);
            socketToUid.set(socket, uid)
            socket.emit("accept_join", uid);
            // Send to all members of the lobby
            io.to("lobby").emit("update_lobby", lobby.getPlayers());
        }
    });

    socket.on("next_character", (uid: number) => {
        lobby.incrementPlayerCharacter(uid);
        io.to("lobby").emit("update_lobby", lobby.getPlayers());
    });

    socket.on("prev_character", (uid: number) => {
        lobby.decrementPlayerCharacter(uid);
        io.to("lobby").emit("update_lobby", lobby.getPlayers());
    });

    socket.on("start_game_request", () => {
        console.log("Game start request");

        game = new BOIGame(lobby.players);

        console.log(game.getGameData())

        io.to("lobby").emit("start_game", game.getGameData());
    })

    socket.on("roll_dice_request", () => {
        let value = Math.ceil(Math.random()*6);
        while(value === 0){
            value = Math.ceil(Math.random()*6);
        }
        
        console.log("Dice rolled:", value);
        io.to("lobby").emit("roll_dice", value);
    })

    socket.on("new_game_data_request", (gameData:IGameData) => {
        io.to("lobby").emit("new_game_data", gameData)
    })

    socket.on("disconnect", (reason) => {
        let uid = socketToUid.get(socket);
        if (uid !== undefined) {
            console.log(lobby.getPlayer(uid).username, "left...");
            console.log("Lobby:", lobby.getPlayers());
            lobby.removePlayer(uid);
            io.to("lobby").emit("update_lobby", lobby.getPlayers());
        }
    });
})


// Start http server on the port
server.listen(PORT, () => {
    console.log("Listening on port", PORT)
});