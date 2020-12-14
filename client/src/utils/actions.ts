import { IAction, ActionType } from './redux';

export const login = (username: string): IAction => ({
    type: ActionType.JOIN_LOBBY,
    payload: username,
});