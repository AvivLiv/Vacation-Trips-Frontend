import "./VacationAdminCard.css";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { EditVacationIdAction } from '../../../Redux/EditVacationState';
import store from '../../../Redux/Store';
import { Globals } from '../../../Services/Global';
import { logoutUser } from '../../../Services/GlobalAuth';
import VacationModel from '../Models/VacationModel';
import { useHistory } from "react-router-dom";
import { errorsService } from '../../../Services/GlobalError';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 300,
            maxHeight:5400,
            display: "inline-block",
        },
        media: {
            paddingTop: '56.25%',
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            color: 'red',
        },
        avatar: {
            backgroundColor: red[500],
        },
        playIcon: {
            right: 10,
            color: 'red'
        },
    }),
);

interface VacationAdminCardProps {
    vacation: VacationModel
}

export default function VacationAdminCard(props: VacationAdminCardProps) {

    const classes = useStyles();

    const history = useHistory();

    const editVacation = () => {
        sessionStorage.setItem("EditVacationId", JSON.stringify(props.vacation.vacationId));
        store.dispatch(EditVacationIdAction(props.vacation.vacationId))
    }

    // Delete vacation 
    const deleteVacation = (async () => {
        try {
            const answer = window.confirm("Are you suer?")
            if (!answer) {
                return;
            }
            else {
                const id = props.vacation.vacationId;
                await axios.delete<VacationModel>(`${Globals.vacationsUrl}${id}`);
            }
        }
        catch (err) {
            if (err.response?.status === 403) {
                logoutUser();
                alert(errorsService.getError(err));
                history.push("/home");
            }
            else{
                alert(errorsService.getError(err));
            }    
        }
    });

    return (

        <div className="VacationAdminCard" style={{ display: "inline-block", marginLeft: "30px", marginTop: "10px" }}>
            <Card className={classes.root} key={props.vacation.vacationId} >
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="140"
                    image={`${Globals.vacationsUrl}image/${props.vacation.imageFileName}`}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography variant="h5"  component="p">
                        {props.vacation.destination}
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography className="description"  component="p"  >
                        {props.vacation.description}
                    </Typography>
                </CardContent>
                <CardContent >
                    <Typography  component="p">
                        From: {new Date(props.vacation.fromDate).toDateString()}
                    </Typography>
                    <Typography  component="p">
                        To:{new Date(props.vacation.toDate).toDateString()}
                    </Typography>
                    <Typography  component="p">
                        Price:{props.vacation.price + "$"}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Typography>
                        <IconButton aria-label="delete vacation"
                            onClick={deleteVacation} >
                            <DeleteForeverIcon />
                        </IconButton>
                        <NavLink onClick={editVacation} to={`/edit-vacation/${props.vacation.vacationId}`}
                        >
                            <IconButton aria-label="edit vacation">
                                <EditIcon />
                            </IconButton>
                        </NavLink>
                    </Typography>
                </CardActions>
            </Card>
        </div>

    );
}