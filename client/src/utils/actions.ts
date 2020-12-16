import { IAction, ActionType, NavState } from './redux';

export const joinLobby = (uid:number): IAction => ({
    type: ActionType.JOIN_LOBBY,
    payload: {uid: uid, navState: NavState.LOBBY}
});