import { Avatar, Button, Grid, Paper, TextField, Typography, Link } from '@material-ui/core';
import React from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { NextPage } from 'next/types';
import './Login.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { UserLoginAction } from '../../../Redux/UsersState';
import store from '../../../Redux/Store';
import { Globals } from '../../../Services/Global';
import { socketManagerInstance } from '../../../Socket.io/SocketManager';
import { authorization } from '../../../Services/GlobalAuth';
import { errorsService } from '../../../Services/GlobalError';

interface FormData {
    userName: string;
    password: string;
}

const Login: NextPage = () => {

    const { handleSubmit, register } = useForm<FormData>();

    const history = useHistory();

    // Login, get data from server
    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await axios.post(`${Globals.authUrl}login`, data);
            const user = response.data;
            sessionStorage.setItem("user", JSON.stringify(user));
            store.dispatch(UserLoginAction(user));
            socketManagerInstance.connect();
            authorization(user);
            history.push("/vacations");
        }
        catch (err) {
            alert(errorsService.getError(err));
        }
    });

    const paperStyle = { padding: 20, height: 300, width: 280, margin: "20px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e', align: 'center', margin: "auto", marginTop: "10px" }
    const btStyle = { margin: '8px 0', marginTop: "10px" }
    const formStyle = { marginTop: '5%' }

    return (

        <form onSubmit={onSubmit} style={formStyle}>
            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Grid >
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2>Sign in</h2>
                    </Grid>
                    <TextField
                       inputProps={{minLength:2,maxLength:25}}
                        fullWidth required
                        inputRef={register}
                        label="Username"
                        name="userName"
                        size="small"
                    />
                    <TextField
                       inputProps={{minLength:2,maxLength:25}}
                        fullWidth required
                        inputRef={register}
                        label="Password"
                        name="password"
                        size="small"
                        type="password"
                    />
                    <Button type="submit" color="primary" variant="contained"
                        style={btStyle} fullWidth>Sign in</Button>
                    <Typography> Do you have an account?
                    <Link href="/register" >
                            Sign up
                    </Link>
                    </Typography>
                </Paper>
            </Grid>
        </form>
        
    );
}

export default Login;