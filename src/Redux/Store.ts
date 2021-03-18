import { userReducer } from "./UsersState";
import { combineReducers, createStore } from "redux";
import { vacationReducer } from "./VacationsState";
import { editVacationReducer } from "./EditVacationState";

const reducers = combineReducers({ userReducer, vacationReducer, editVacationReducer });
const store = createStore(reducers);

export default store;