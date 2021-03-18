import "./EditUser.css";
import { Avatar, Button, Grid, Paper, TextField, Container } from '@material-ui/core';
import { NextPage } from 'next/types';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { UserEditedAction } from '../../../Redux/UsersState';
import store from '../../../Redux/Store';
import Logout from "../Logout/Logout";
import { Unsubscribe } from "redux";
import { useEffect, useState } from 'react';
import UserModel from "../Models/UserModel";
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import { Globals } from "../../../Services/Global";
import { logoutUser } from "../../../Services/GlobalAuth";
import { errorsService } from "../../../Services/GlobalError";

interface FormData {
    firstName: string;
    lastName: string;
    userName: string;
}

const EditUser: NextPage = () => {

    const history = useHistory();

    const { handleSubmit, register } = useForm<FormData>();

    const userState = useState<UserModel>(store.getState().userReducer.user);
    const user = userState[0];
    const userSetState = userState[1];

    // Listening to change on redux
    useEffect(() => {
        const unSubscribe: Unsubscribe = store.subscribe(() => {
            const user = store.getState().userReducer.user;
            userSetState(user);
        })
        return unSubscribe;
    });

    // Send new user to server
    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await axios.put(`${Globals.usersUrl}update/` + user.userId, data);
            sessionStorage.setItem("user", JSON.stringify(response.data));
            store.dispatch(UserEditedAction(response.data));
            history.push("/vacations");
        }
        catch (err) {
            if (err.response?.status === 403) {
                logoutUser();
                history.push("/home");
                alert(errorsService.getError(err));
            }
            else{
                alert(errorsService.getError(err));
            }
        }
    });

    const paperStyle = { padding: 20, height: 350, width: 280, margin: "20px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e', align: 'center', margin: "auto", marginTop: "10px" }
    const btStyle = { margin: '8px 0', marginTop: "10px" }
    const containerStyle = { marginTop: '5%' }

    return (
        
        <div>
            <Container style={containerStyle}>
                <form onSubmit={onSubmit}>
                    <Grid>
                        <Paper elevation={10} style={paperStyle}>
                            <Grid >
                                <Avatar style={avatarStyle}><EditIcon /></Avatar>
                                <h2>Edit user</h2>
                            </Grid>
                            <TextField defaultValue={user.firstName}
                             inputProps={{minLength:2,maxLength:25}}
                                fullWidth required
                                inputRef={register}
                                label="First name"
                                name="firstName"
                                size="small"
                            />
                            <TextField defaultValue={user.lastName}
                             inputProps={{minLength:2,maxLength:25}}
                                fullWidth required
                                inputRef={register}
                                label="Last name"
                                name="lastName"
                                size="small"
                            />
                            <TextField defaultValue={user.userName}
                             inputProps={{minLength:2,maxLength:25}}
                                fullWidth required
                                inputRef={register}
                                label="Username"
                                name="userName"
                                size="small"
                            />
                            <Button type="submit" color="primary" variant="contained"
                                style={btStyle} fullWidth>Update details  <SendIcon fontSize="small" /></Button>
                            <Logout />
                        </Paper>
                    </Grid>
                </form>
            </Container>
        </div>

    );
}

export default EditUser;