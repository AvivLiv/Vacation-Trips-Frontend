import UserModel from "../Components/UserArea/Models/UserModel";
import { authorization } from "../Services/GlobalAuth";

export class UserState {
    public user: UserModel = null;

    constructor() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            authorization(user);
            this.user = user;
        }

    }
}

export enum UserActionType {
    UserLogin = "userLogin",
    UserLogout = "userLogout",
    UserEdited = "userEdited"
}

export interface UserAction {
    type: UserActionType;
    payload?: any;
}

export function UserLoginAction(user: UserModel): UserAction {
    return { type: UserActionType.UserLogin, payload: user };
}

export function UserEditedAction(user: UserModel): UserAction {
    return { type: UserActionType.UserEdited, payload: user };
}

export function UserLogoutAction(): UserAction {
    return { type: UserActionType.UserLogout };
}

export function userReducer(
    currentSate: UserState = new UserState(),
    action: UserAction
): UserState {
    const newState = { ...currentSate };
    switch (action.type) {
        case UserActionType.UserLogin:
            newState.user = action.payload;
            break;
        case UserActionType.UserEdited:
            newState.user = action.payload;
            break;
        case UserActionType.UserLogout:
            newState.user = null;
            break;
    }
    return newState;
}
