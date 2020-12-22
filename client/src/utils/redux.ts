import { stat } from 'fs';
import { createStore } from 'redux';
import { ActionType, IAction } from './actions';

export enum NavState {
    LOGIN,
    LOBBY,
    GAME,
}

export interface IPlayer {
    uid: number
    username: string
    characterIndex: number

    hand: any[] // TODO
}

export interface IState {
    navState: NavState

    uid: number
    players: IPlayer[]
}

const initialState = {
    navState: NavState.LOGIN,

    uid: 0,
    players: [],
} as IState

const reducer = (state: IState = initialState, action: IAction): IState => {
    switch (action.type) {
        case ActionType.JOIN_LOBBY:
            state = {
                ...state,
                uid: action.payload,
                navState: NavState.LOBBY,
            }
            break;
        case ActionType.SET_PLAYERS:
            state = {
                ...state,
                players: action.payload,
            }
            break;
        case ActionType.START_GAME:
            state = {
                ...state,
                navState: NavState.GAME,
            }
            break;
        default:
            return state
    }
    return state;
}


export const store = createStore(reducer);