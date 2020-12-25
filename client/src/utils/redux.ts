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
    diceValue: number
    rollToggle: boolean // Used to notify the dice for when it is rolled
}

const initialState = {
    navState: NavState.LOGIN,

    uid: 0,
    players: [],

    diceValue: 1,
    rollToggle: false
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
        case ActionType.ROLL_DICE:
            state = {
                ...state,
                diceValue: action.payload,
                rollToggle: !state.rollToggle
            }
            break;
        default:
            return state
    }
    return state;
}


export const store = createStore(reducer);