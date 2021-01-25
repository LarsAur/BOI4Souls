import { Server, Socket } from 'socket.io'
import http from 'http'
import fs from 'fs';

import BOILobby from './lobby';
import BOIGame from './game';
import { IMove, IGameEdit, ICardTiltRequest, IHandVisabilityRequest , IHandAccessibilityRequest} from '../../client/src/utils/interfaces';

const PORT = 8080;

let lobby = new BOILobby();
let game: BOIGame;
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

    
    socket.on("move_request", (moveRequest: IMove) => {
        console.log(moveRequest)

        if (!game.isMoveEffective(moveRequest)) {
            console.log("Ineffective move")
            return; // Do nothing if the move has no effect on the gameData
        }

        if (game.isMoveValid(moveRequest)) {
            // Reset card tilt if the card is moved to another droppable
            if (moveRequest.sourceType != moveRequest.destinationType || moveRequest.sourceTypeIndex != moveRequest.destinationTypeIndex) {
                game.resetCard(moveRequest.cardId);
            }
            game.performMove(moveRequest);
            console.log("sending update...")
            updateLobbyMembers();
        } else {
            console.log("invalid move")
            socket.emit("invalid_move");
        }
    });

    socket.on("tilt_card_request", (tiltRequest: ICardTiltRequest) => {
        game.setCardTilt(tiltRequest.value, tiltRequest.cardId);
        updateLobbyMembers();
    })

    socket.on("increment_cent_request", () => {
        let uid = socketToUid.get(socket);
        game.incrementCentCounter(uid);
        updateLobbyMembers();
    });

    socket.on("decrement_cent_request", () => {
        let uid = socketToUid.get(socket);
        game.decrementCentCounter(uid);
        updateLobbyMembers();
    });

    socket.on("increment_card_request", (cardId: number) => {
        game.incrementCounter(cardId);
        updateLobbyMembers();
    });

    socket.on("decrement_card_request", (cardId: number) => {
        game.decrementCounter(cardId);
        updateLobbyMembers();
    });

    socket.on("request_set_hand_visability", (request: IHandVisabilityRequest) => {
        const seenUid: number = socketToUid.get(socket);
        game.setHandVisability(request.seerUid, seenUid, request.value);
        updateLobbyMembers();
    });

    socket.on("request_set_hand_accessibility", (request: IHandAccessibilityRequest) => {
        const uid: number = socketToUid.get(socket);
        game.setHandAccessiblity(uid, request.value);
        updateLobbyMembers();
    });

    socket.on("request_edit_deck", () => {
        const uid:number = socketToUid.get(socket);
        if(game.setPlayerEdit(uid)){
            updateLobbyMembers();
        }
    });

    socket.on("relieve_edit_deck", () => {
        const uid:number = socketToUid.get(socket);
        if(game.removePlayerEdit(uid)){
            updateLobbyMembers();
        }
    });

    socket.on("request_gamedata_refresh", () => {
        socket.emit("new_game_data", game.getGameData());
    });

    socket.on("publish_gamedata_edit", (edit:IGameEdit) => {
        game.performGameEdit(edit);
        updateLobbyMembers();
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
});

function updateLobbyMembers(): void {
    io.to("lobby").emit("new_game_data", game.getGameData());
}


// Start http server on the port
server.listen(PORT, () => {
    console.log("Listening on port", PORT)
});