import { IGameData, IPlayer } from './interfaces';

export enum ActionType {
    JOIN_LOBBY,
    SET_PLAYERS,
    START_GAME,
    ROLL_DICE,
    SET_GAME_DATA,
}

export interface IAction {
    type: ActionType,
    payload: any,
}

export const joinLobby = (uid: number): IAction => ({
    type: ActionType.JOIN_LOBBY,
    payload: uid
});

export const setPlayers = (players: IPlayer[]): IAction => ({
    type: ActionType.SET_PLAYERS,
    payload: players
});

export const startGame = (gameData: IGameData): IAction => ({
    type: ActionType.START_GAME,
    payload: gameData
});

export const rollDice = (value: number): IAction => ({
    type: ActionType.ROLL_DICE,
    payload: value
})

export const setGameData = (gameData: IGameData): IAction => ({
    type: ActionType.SET_GAME_DATA,
    payload: gameData
});