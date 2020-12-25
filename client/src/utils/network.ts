import { io, Socket } from 'socket.io-client';
import { IState, IPlayer } from './redux';
import { IAction, joinLobby, setPlayers, startGame, rollDice} from './actions';
import { Store } from 'redux';
import AudioManager from './audioManager';

const ioAddress = "ws://localhost:80";

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

        Network.socket.on("start_game", () => {
            Network.store.dispatch(startGame());
        });

        /******These can only be triggered once in game *********/
        Network.socket.on("roll_dice", (value: number) => {
            Network.store.dispatch(rollDice(value));
            AudioManager.stop("dice");
            AudioManager.play("dice");
        })
    }

    static nextCharacter(){
        console.log(Network.store.getState().players[0].characterIndex)
        Network.socket.emit("next_character", Network.store.getState().uid);
    }
    
    static prevCharacter(){
        console.log(Network.store.getState().players[0].characterIndex)
        Network.socket.emit("prev_character", Network.store.getState().uid);
    }

    static sendStartGameRequest(){
        Network.socket.emit("start_game_request");
    }

    static rollDice(){
        Network.socket.emit("roll_dice_request");
    }
}
