import { createStore } from 'redux';
import { ActionType, IAction } from './actions';

export enum NavState {
    LOGIN,
    LOBBY,
    GAME,
}

export interface IPlayer {
    username: string
    uid: number

    characterIndex: number
    coins: number
    hand: number[] // Ids of the cards in the hand
    field: number[] // Ids of the card in the field
}

export interface IGameData{
    players: IPlayer[];

    monsterDeck : number[];
    lootDeck : number[];
    treasureDeck: number[];
    bonusSoulsDeck: number[];
}

export interface IState {
    navState: NavState

    uid: number
    players: IPlayer[]
    gameData: IGameData
    diceValue: number
    rollToggle: boolean // Used to notify the dice for when it is rolled
}

const initialState = {
    navState: NavState.LOGIN,

    uid: 0,
    players: [],
    gameData: {} as IGameData,

    diceValue: 1,
    rollToggle: false,
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
                players: (action.payload as IGameData).players,
                gameData: (action.payload as IGameData)
            }
            break;
        case ActionType.ROLL_DICE:
            state = {
                ...state,
                diceValue: action.payload,
                rollToggle: !state.rollToggle
            }
            break;
        case ActionType.SET_GAME_DATA:
            state = {
                ...state,
                gameData: action.payload,
                players: action.payload.players,
            }
            break;
        default:
            return state
    }
    return state;
}


export const store = createStore(reducer);