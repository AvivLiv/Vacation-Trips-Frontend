import React, { useEffect, useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { BrowserRouter, Switch, Route, Link, Redirect, } from 'react-router-dom';
import VacationsList from '../../VacationsArea/VacationsList/VacationsList';
import HomeIcon from '@material-ui/icons/Home';
import { AppBar } from '@material-ui/core';
import Register from '../../UserArea/Register/Register';
import Login from '../../UserArea/Login/Login';
import AddVacation from '../../VacationsArea/AddVacation/AddVacation';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EditUser from '../../UserArea/EditUser/EditUser';
import Home from '../Home/Home';
import Logout from '../../UserArea/Logout/Logout';
import UserModel from '../../UserArea/Models/UserModel';
import { Unsubscribe } from "redux";
import EditVacation from '../../VacationsArea/EditVacation/EditVacation';
import store from '../../../Redux/Store';
import AdminPage from "../../VacationsArea/AdminPage/AdminPage";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { EditVacationIdAction } from '../../../Redux/EditVacationState';
import { GlobalPath } from "../../../Services/GlobalPath";



export default function VacationTab() {

    const vacationState = useState(store.getState().editVacationReducer.EditVacationId);
    const vacation = vacationState[0];
    const vacationSetState = vacationState[1];

    const userState = useState<UserModel>(store.getState().userReducer.user);
    const user = userState[0];
    const userSetState = userState[1];

    // Listening to change on redux
    useEffect(() => {
        const unSubscribe: Unsubscribe = store.subscribe(() => {
            const user = store.getState().userReducer.user;
            const vacation = store.getState().editVacationReducer.EditVacationId;
            userSetState(user);
            vacationSetState(vacation);
        })
        return unSubscribe;
    });

    const sendEditVacationId = () => {
        sessionStorage.setItem("EditVacationId", JSON.stringify(0));
        store.dispatch(EditVacationIdAction(0))
    }

    const routes = [GlobalPath.homeLinkUrl, GlobalPath.vacationsLinkUrl, GlobalPath.registerLinkUrl, GlobalPath.addVacationLinkUrl, GlobalPath.editUserLinkUrl, vacation !== 0 ? GlobalPath.editVacationLinkUrl + vacation : null, GlobalPath.adminPageLinkUrl];

    return (
        <BrowserRouter>
            <Route path="/" render={(history) => (
                <AppBar  >
                    <Tabs
                        value={history.location.pathname !== "/" ? history.location.pathname : false}
                        variant="fullWidth"
                        scrollButtons="on"
                    >
                        <Tab icon={<HomeIcon />} label="Home" onClick={sendEditVacationId} value={routes[0]} component={Link} to={routes[0]} />
                        {user ? <Tab onClick={sendEditVacationId} icon={<FlightTakeoffIcon />} label="Vacations" value={routes[1]} component={Link} to={routes[1]} /> :
                            <Tab onClick={sendEditVacationId} icon={<FlightTakeoffIcon />} label="Vacations" value={routes[1]} component={Link} to={routes[0]} />}
                        {!user ? <Tab icon={<AssignmentOutlinedIcon />} label="Register" value={routes[2]} component={Link} to={routes[2]} /> : null}
                        {user && user.isAdmin === 1 ? <Tab onClick={sendEditVacationId} icon={<AddCircleOutlineOutlinedIcon />} label="Add vacation " value={routes[3]} component={Link} to={routes[3]} /> : null}
                        {vacation !== 0 && user && user.isAdmin === 1 ? <Tab icon={<AssignmentOutlinedIcon />} label="Edit vacation" value={routes[5]} component={Link} to={routes[5]} /> : null}
                        {user && user.isAdmin === 1 ? <Tab onClick={sendEditVacationId} icon={<AssignmentOutlinedIcon />} label="Admin page" value={routes[6]} component={Link} to={routes[6]} /> : null}
                        {user ? <Tab onClick={sendEditVacationId} icon={<AccountCircleIcon />} label={`Hello ${user.firstName} ${user.lastName}`} value={routes[4]} component={Link} to={routes[4]} /> :
                            <Tab icon={<AccountCircleIcon />} label={`Hello Guest`} value={routes[4]} component={Link} to={routes[0]} />}
                        {!routes.includes(history.location.pathname) ? <Tab value={history.location.pathname} /> : null}
                    </Tabs>
                </AppBar>
            )}
            />

            <Switch>
                <Route path={GlobalPath.homeLinkUrl} component={Home} exact />
                <Route path={GlobalPath.vacationsLinkUrl} component={VacationsList} exact />
                <Route path={GlobalPath.loginLinkUrl} component={Login} exact />
                <Route path={GlobalPath.logoutLinkUrl} component={Logout} exact />
                <Route path={GlobalPath.registerLinkUrl} component={Register} exact />
                <Route path={GlobalPath.addVacationLinkUrl} component={AddVacation} exact />
                <Route path={GlobalPath.editVacationLinkUrl + "/:vacationId"} component={EditVacation} exact />
                <Route path={GlobalPath.editUserLinkUrl} component={EditUser} exact />
                <Route path={GlobalPath.adminPageLinkUrl} component={AdminPage} exact />
                <Redirect from="*" to={GlobalPath.homeLinkUrl} exact />
            </Switch>
        </BrowserRouter>
    );
}

