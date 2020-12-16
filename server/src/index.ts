import { Server } from 'socket.io'
import http from 'http'
import fs from 'fs';

import BOILobby from './lobby';

const PORT = 80;

let lobby = new BOILobby();
let game;

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

// Create socket.io server
const io = new Server();
// Setup listeners for socket.io connections
io.on('connection', (socket) => {
    socket.on("request_join", (username: string) => {
        if (lobby.isSpace()) {
            socket.join("lobby");
            let uid:number = 0; // TODO
            socket.emit("accept_join", uid);
            socket.to("lobby").emit("joined", lobby.players)
        }
    });

    socket.on("next_character", (uid: number) => {

    });

    socket.on("prev_character", (uid: number) => {

    })
})

// Start http server on the port
server.listen(PORT, () => {
    console.log("Listening on port", PORT)
});