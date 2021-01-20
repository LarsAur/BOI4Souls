import { io, Socket } from 'socket.io-client';
import { IState } from './redux';
import { IAction, joinLobby, setPlayers, startGame, rollDice, setGameData } from './actions';
import { Store } from 'redux';
import { IPlayer, IGameData, IMove, ICardTiltRequest, DroppableType, IHandVisabilityRequest, IHandAccessibilityRequest } from './interfaces';
import AudioManager from './audioManager';

const ioAddress = window.origin === "http://localhost:3000" ? "ws://localhost:80" : window.origin;

export default class Network {

    static socket: Socket;
    static store: Store<IState, IAction>

    static setupNetwork(store: Store<IState, IAction>) {
        // Connect to websocket
        Network.socket = io(ioAddress);
        Network.store = store;
    }

    static requestJoinLobby(username: string) {
        Network.socket.emit("request_join", username);

        Network.socket.once("accept_join", (uid: number) => {
            Network.store.dispatch(joinLobby(uid));
        });

        /*******These can only be triggered once in the lobby*******/
        Network.socket.on("update_lobby", (players: IPlayer[]) => {
            Network.store.dispatch(setPlayers(players))
            console.log(Network.store.getState().players[0].characterIndex)
        });

        Network.socket.on("start_game", (gameData: IGameData) => {
            Network.store.dispatch(startGame(gameData));
        });

        /******These can only be triggered once in game *********/
        Network.socket.on("roll_dice", (value: number) => {
            Network.store.dispatch(rollDice(value));
            AudioManager.stop("dice");
            AudioManager.play("dice");
        })

        Network.socket.on("new_game_data", (gameData: IGameData) => {
            console.log("new game data")
            Network.store.dispatch(setGameData(gameData));
        })
    }

    static nextCharacter() {
        Network.socket.emit("next_character", Network.store.getState().uid);
    }

    static prevCharacter() {
        Network.socket.emit("prev_character", Network.store.getState().uid);
    }

    static requestCentIncrement(){
        Network.socket.emit("increment_cent_request")
    }

    static requestCentDecrement(){
        Network.socket.emit("decrement_cent_request")
    }

    static requestCardIncrement(cardId: number) {
        Network.socket.emit("increment_card_request", cardId)
    }
    
    static requestCardDecrement(cardId: number) {
        Network.socket.emit("decrement_card_request", cardId)
    }

    static sendStartGameRequest() {
        Network.socket.emit("start_game_request");
    }

    static rollDice() {
        Network.socket.emit("roll_dice_request");
    }

    // Set wether the player with the uid can see your hand or not
    static requestSetHandVisability(val: boolean, uid: number){
        let request: IHandVisabilityRequest = {
            seerUid: uid,
            value: val,
        };
        Network.socket.emit("request_set_hand_visability", request);
    }

    static requestSetHandAccessibility(val: boolean){
        let request: IHandAccessibilityRequest = {
            value: val
        }
        Network.socket.emit("request_set_hand_accessibility", request);
    }

    static sendMoveRequest(srcType: DroppableType, srcIndex: number, srcInnerIndex: number, destDropType: DroppableType, destIndex: number, destInnerIndex: number, cardId: number) {
        let move: IMove = {
            sourceType: srcType,
            sourceTypeIndex: srcIndex,
            sourceInnerIndex: srcInnerIndex,
            destinationType: destDropType,
            destinationTypeIndex: destIndex,
            destinationInnerIndex: destInnerIndex,
            cardId: cardId,
        }

        console.log("Move request: ", move);

        Network.socket.emit("move_request", move);
    }

    static sendTiltRequest(cardId: number, value: boolean) {
        let req: ICardTiltRequest = {
            cardId: cardId,
            value: value
        }
        Network.socket.emit("tilt_card_request", req);
    }
}
