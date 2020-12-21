import { io, Socket } from 'socket.io-client';
import { IState, IPlayer } from './redux';
import { IAction, joinLobby, setPlayers } from './actions';
import { Store } from 'redux';

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

        Network.socket.on("update_lobby", (players: IPlayer[]) => {
            Network.store.dispatch(setPlayers(players))
            console.log(Network.store.getState().players[0].characterIndex)
        });
    }

    static nextCharacter(){
        console.log(Network.store.getState().players[0].characterIndex)
        Network.socket.emit("next_character", Network.store.getState().uid);
    }
    
    static prevCharacter(){
        console.log(Network.store.getState().players[0].characterIndex)
        Network.socket.emit("prev_character", Network.store.getState().uid);
    }

    static startGame(){
        Network.socket.emit("start_game_request");
    }
}
