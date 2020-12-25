import { IPlayer } from './redux';

export enum ActionType{
    JOIN_LOBBY,
    SET_PLAYERS,
    START_GAME,
    ROLL_DICE,
}

export interface IAction {
    type: ActionType,
    payload: any,
}

export const joinLobby = (uid:number): IAction => ({
    type: ActionType.JOIN_LOBBY,
    payload: uid
});

export const setPlayers = (players: IPlayer[]) :IAction => ({
    type: ActionType.SET_PLAYERS,
    payload: players
});

export const startGame = ():IAction => ({
    type: ActionType.START_GAME,
    payload: null
});

export const rollDice = (value:number):IAction => ({
    type: ActionType.ROLL_DICE,
    payload: value
})