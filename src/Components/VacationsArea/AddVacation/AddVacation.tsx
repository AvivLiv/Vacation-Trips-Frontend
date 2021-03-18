import { NextPage } from 'next/types';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import VacationModel from "../Models/VacationModel";
import { useHistory } from "react-router-dom";
import { Globals } from '../../../Services/Global';
import { logoutUser } from "../../../Services/GlobalAuth";
import { useState } from 'react';
import { errorsService } from '../../../Services/GlobalError';
import { Paper } from '@material-ui/core';

interface FormData {
    destination: string;
    description: string;
    fromDate: string;
    toDate: string;
    price: number;
    imageFileName: FileList;
}

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
    },
}));

const AddVacation: NextPage = () => {

    const { handleSubmit, register } = useForm<FormData>();

    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

    const classes = useStyles();

    const history = useHistory();

    // Add new vacation and send new vacation to server
    const onSubmit = handleSubmit(async (data) => {
        try {
            const myFormData = new FormData();
            myFormData.append("destination", data.destination);
            myFormData.append("description", data.description);
            myFormData.append("fromDate", data.fromDate.toString());
            myFormData.append("toDate", data.toDate.toString());
            myFormData.append("price", data.price.toString());
            myFormData.append("imageFileName", data.imageFileName.item(0));
            await axios.post<VacationModel>(Globals.vacationsUrl, myFormData);
            history.push("/vacations");
        }
        catch (err) {
            if (err.response?.status === 403) {
                history.push("/home");
                logoutUser();
                alert(errorsService.getError(err));
            }
            else {
                alert(errorsService.getError(err));
            }
        }
    });
    const paperStyle = { padding: 20, maxHeight: "fitContent", maxWidth: 400, margin: "20px auto" }
    return (

        <form onSubmit={onSubmit} action="/upload-image" method="POST" encType="multipart/form-data">
            <h2>Add vacation</h2>
            <Container className={classes.container} maxWidth="xs">
                <Paper elevation={10} style={paperStyle}>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ minLength: 3, maxLength: 30 }}
                                    fullWidth required
                                    inputRef={register}
                                    label="Destination"
                                    name="destination"
                                    size="small"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                
                                    inputProps={{ minLength: 5, maxLength: 1000 }}
                                    fullWidth required
                                    multiline
                                    inputRef={register}
                                    label="Description"
                                    name="description"
                                    size="small"
                                    type="textarea"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: new Date().toISOString().slice(0, 10), max: "2050-01-01" }}
                                    fullWidth required
                                    inputRef={register}
                                    label="From date"
                                    name="fromDate"
                                    size="small"
                                    type="date"
                                    variant="outlined"
                                    onChange={e => setDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: date, max: "2050-01-01" }}
                                    fullWidth required
                                    inputRef={register}
                                    label="To date"
                                    name="toDate"
                                    size="small"
                                    type="date"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ min: 300, max: 10000 }}
                                    fullWidth required
                                    inputRef={register}
                                    label="Price"
                                    name="price"
                                    size="small"
                                    type="number"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ accept: "image/*" }}
                                    fullWidth required
                                    inputRef={register}
                                    name="imageFileName"
                                    size="small"
                                    type="file"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" color="primary" fullWidth variant="contained">
                            Add vacation
              </Button>
                    </Grid>
                </Grid>
                </Paper>
            </Container>
         
        </form>

    );
};

export default AddVacation;