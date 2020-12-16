import {createStore} from 'redux';

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

export interface IState{
    navState: NavState
    username: string
    uid: number
    usernames: string[]
    userIds: number[]
}

const initialState = {
    navState: NavState.LOGIN,
    username: "",
    uid: 0,
    usernames: [],
    userIds: [],

} as IState

const reducer = (state:IState = initialState, action: IAction): IState => {
    switch(action.type) {
        case ActionType.JOIN_LOBBY:
            state = {
                ...state,
                uid: action.payload.uid,
                navState: action.payload.navState,
            }
            break;
        default:
            return state
    }
    return state;
}


const store = createStore(reducer);
export default store;