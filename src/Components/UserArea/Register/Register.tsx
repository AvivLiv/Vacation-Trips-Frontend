import { Avatar, Button, Grid, Paper, TextField, Typography, Link, Container } from '@material-ui/core';
import React from 'react';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { NextPage } from 'next/types';
import './Register.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { Globals } from '../../../Services/Global';
import { errorsService } from '../../../Services/GlobalError';

interface FormData {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
}

const Register: NextPage = () => {

    const history = useHistory();

    const { handleSubmit, register } = useForm<FormData>();

    // Add new user and sent new user to server
    const onSubmit = handleSubmit(async (data) => {
        try {
            await axios.post(`${Globals.authUrl}register`, data);
            history.push("/home");
        }
        catch (err) {
            alert(errorsService.getError(err));
        }
    });

    const paperStyle = { padding: 20, height: 370, width: 280, margin: "20px auto" }
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
                                <Avatar style={avatarStyle}><AssignmentOutlinedIcon /></Avatar>
                                <h2>Sign up</h2>
                            </Grid>
                            <TextField
                                inputProps={{minLength:2,maxLength:25}}
                                fullWidth required
                                inputRef={register}
                                label="First name"
                                name="firstName"
                                size="small"
                            />
                            <TextField
                            inputProps={{minLength:2,maxLength:25}}
                                fullWidth required
                                inputRef={register}
                                label="Last name"
                                name="lastName"
                                size="small"
                            />
                            <TextField
                            inputProps={{minLength:2,maxLength:25}}
                                fullWidth required
                                inputRef={register}
                                label="Username"
                                name="userName"
                                size="small"
                            />
                            <TextField
                            inputProps={{minLength:4,maxLength:250}}
                                fullWidth required
                                inputRef={register}
                                label="Password"
                                name="password"
                                size="small"
                                type="password"
                            />
                            <Button type="submit" color="primary" variant="contained" style={btStyle}
                                fullWidth>Sign up</Button>
                            <Typography> Do you have an account?
                    <Link href="/home" >
                                    Sign in
                    </Link>
                            </Typography>
                        </Paper>
                    </Grid>
                </form>
            </Container>
        </div>

    );
}

export default Register;