import { socketManagerInstance } from './../Socket.io/SocketManager';
import axios from "axios";
import UserModel from "../Components/UserArea/Models/UserModel";
import { UserLogoutAction } from "../Redux/UsersState";
import store from '../Redux/Store';
import { VacationCleanAction } from '../Redux/VacationsState';
import { EditVacationCleanAction } from '../Redux/EditVacationState';

// Add Bearer token to user
export function authorization(user: UserModel) {
    axios.defaults.headers["authorization"] = `Bearer ${user.token}`;
    return;
}

// Clean all data on user from project after logout
export function logoutUser(){
    sessionStorage.clear();
    store.dispatch(UserLogoutAction());
    store.dispatch(VacationCleanAction());
    store.dispatch(EditVacationCleanAction());
    delete axios.defaults.headers["authorization"];
    socketManagerInstance.disconnect();
    return;
}