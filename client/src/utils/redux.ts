import {createStore} from 'redux';
import {login} from './actions';

export enum NavState{
    LOGIN,
    LOBBY,
    GAME,
}

export enum ActionType{
    SET_NAME,
    JOIN_LOBBY,
    START_GAME,
    SET_USERNAME,
}

export interface IAction{
    type: ActionType,
    payload: any,
}

interface IState{
    navState: NavState
    username: string
    userId: number
    usernames: string[]
    userIds: number[]
}

const initialState = {
    navState: NavState.LOGIN,
    username: "",
    userId: 0,
    usernames: [],
    userIds: [],

} as IState

const reducer = (state:IState = initialState, action: IAction): IState => {
    switch(action.type) {
        case ActionType.SET_NAME:
            state = {
                ...state,
                username: action.payload
            };
            break;
        case ActionType.JOIN_LOBBY:
            state = {
                ...state,
                navState: NavState.LOBBY,
            }
            break;
        default:
            return state
    }
    return state;
}


const store = createStore(reducer);
export default store;