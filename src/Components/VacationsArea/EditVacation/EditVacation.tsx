import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import VacationModel from "../Models/VacationModel";
import { useHistory } from "react-router-dom";
import { History } from "history";
import { RouteComponentProps } from "react-router-dom";
import store from '../../../Redux/Store';
import { Globals } from '../../../Services/Global';
import { useEffect, useState } from 'react';
import { EditVacationIdAction } from '../../../Redux/EditVacationState';
import { logoutUser } from "../../../Services/GlobalAuth";
import { errorsService } from '../../../Services/GlobalError';
import { Paper } from '@material-ui/core';

interface FormData {
    vacationId: number;
    destination: string;
    description: string;
    fromDate: string;
    toDate: string;
    price: number;
    imageFileName: string;
    newImageFileName: FileList;
}

interface MatchParams {
    vacationId: string;
}

interface EditVacationProps extends RouteComponentProps<MatchParams> {
    history: History;
}

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
    },
}));

function EditVacation(props: EditVacationProps): JSX.Element {

    const history = useHistory();

    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

    const vacation = store.getState().vacationReducer.vacation.find(v => v.vacationId === +props.match.params.vacationId);


    useEffect(() => {
        if (!vacation) {
            store.dispatch(EditVacationIdAction(0));
            props.history.push("/vacations");
            return;
        }
    });

    if (vacation) {
        vacation.fromDate = new Date(vacation.fromDate).toISOString().slice(0, 10);
        vacation.toDate = new Date(vacation.toDate).toISOString().slice(0, 10);
    }

    const { handleSubmit, register } = useForm<FormData>({ defaultValues: vacation });

    const classes = useStyles();

     // Edit vacation and send the change's vacation to server
    const onSubmit = handleSubmit(async (data) => {
        try {
            data.vacationId = +props.match.params.vacationId;
            const myFormData = new FormData();
            myFormData.append("vacationId", data.vacationId.toString());
            myFormData.append("destination", data.destination);
            myFormData.append("description", data.description);
            myFormData.append("fromDate", data.fromDate.toString());
            myFormData.append("toDate", data.toDate.toString());
            myFormData.append("price", data.price.toString());
            myFormData.append("imageFileName", vacation.imageFileName);
            if (data.newImageFileName.item(0) !== null) {
                myFormData.append("newImageFileName", data.newImageFileName.item(0));
            }
            await axios.put<VacationModel>(`${Globals.vacationsUrl}` + vacation.vacationId, myFormData);
            history.push("/vacations");
            store.dispatch(EditVacationIdAction(0));  
        }
        catch (err) {
            if (err.response?.status === 403) {
                history.push("/home");  
                logoutUser();
                return alert(errorsService.getError(err));
            }
            else {
                alert(errorsService.getError(err));
            }
        }
    });
    const paperStyle = { padding: 20, maxHeight: "fitContent", maxWidth: 400, margin: "20px auto" }

    return (

        <form onSubmit={onSubmit} action="/upload-image" method="POST" encType="multipart/form-data">
            <h2>Edit vacation</h2>
            <Container className={classes.container} maxWidth="xs">
            <Paper elevation={10} style={paperStyle}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth required
                                    inputProps={{ minLength: 3, maxLength: 30 }}
                                    inputRef={register}
                                    label={"Destination"}
                                    name="destination"
                                    size="small"
                                    variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth required
                                    inputProps={{ minLength: 5, maxLength: 1000 }}
                                    multiline
                                    inputRef={register}
                                    label="Description"
                                    name="description"
                                    size="small"
                                    variant="outlined" />
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
                                    onChange={e => setDate(e.target.value)} />
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
                                    variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ minLength: 300, maxLength: 10000 }}
                                    fullWidth required
                                    inputRef={register}
                                    label="Price"
                                    name="price"
                                    size="small"
                                    type="number"
                                    variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ accept: "image/*" }}
                                    inputRef={register}
                                    name="newImageFileName"
                                    size="small"
                                    type="file"
                                    variant="outlined" />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" color="primary" fullWidth variant="contained">
                            Edit vacation
                        </Button>
                    </Grid>
                </Grid>
                </Paper>
            </Container>
        </form>

    );
}

export default EditVacation;