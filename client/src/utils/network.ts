import { io, Socket } from 'socket.io-client';
import { IState, IAction } from './redux';
import { Store } from 'redux';
import { joinLobby } from './actions';

const ioAddress = "http://localhost:80";

export default class Network {

    static socket: Socket;
    static store: Store<IState, IAction>

    static setupNetwork(store: Store<IState, IAction>) {
        // Connect to websocket
        this.socket = io(ioAddress);

        this.socket.on("accept_join", (uid: number) => {
            store.dispatch(joinLobby(uid));
        })
    }

    static requestJoinLobby(username: string) {
        this.socket.emit("request_join", username);
    }
}
