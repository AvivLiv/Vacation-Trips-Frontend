import "./VacationUserCard.css";
import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VacationModel from '../Models/VacationModel';
import axios from 'axios';
import store from '../../../Redux/Store';
import { Globals } from '../../../Services/Global';
import FollowModel from '../../FollowsArea/Model/FollowModel';
import { FollowAddedAction, FollowDeletedAction, VacationEditedAction } from '../../../Redux/VacationsState';
import { Unsubscribe } from 'redux';
import { logoutUser } from "../../../Services/GlobalAuth";
import { useHistory } from "react-router-dom";
import { errorsService } from '../../../Services/GlobalError';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 300,
            maxHeight: 540,
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

interface VacationUserCardProps {
    vacation: VacationModel
}

export default function VacationUserCard(props: VacationUserCardProps) {

    const classes = useStyles();

    const history = useHistory();

    const [expanded, setExpanded] = useState(false);

    let mount = true;

    // Get all follows from server, and save them in redux
    useEffect(() => {
        (async function () {
            const response = await axios.get<FollowModel[]>(`${Globals.followsUrl}${props.vacation.vacationId}`);
            const follows = response.data;
            if (follows.find(f => f.userId === store.getState().userReducer.user.userId)) {
                if (mount)
                    setExpanded(!expanded);
                props.vacation.userFollow = true;
                store.dispatch(VacationEditedAction(props.vacation));
            }
        })();
        const unSubscribe: Unsubscribe = store.subscribe(activeFollow);
        return () => {
            mount = false;
            unSubscribe();
        };
    }, []);

    const followState = useState<number>(props.vacation.follows ? props.vacation.follows : 0);
    const follow = followState[0];
    const followSetState = followState[1];

    // Check if have follows to vacation
    const activeFollow = () => {
        const vacation = store.getState().vacationReducer.vacation.find(v => v.vacationId === props.vacation.vacationId);
        let follow = 0;
        if (vacation?.follows) {
            follow = vacation.follows;
        }
        followSetState(follow);
    }

    // Send follow to server and redux, and change the color to follow
    const handleExpandClick = async () => {
        try {
            if (!expanded) {
                await axios.post(`${Globals.followsUrl}add-follow/${props.vacation.vacationId}/${store.getState().userReducer.user.userId}`);
                store.dispatch(FollowAddedAction(props.vacation));
            }
            else {
                await axios.delete(`${Globals.followsUrl}delete-follow/${props.vacation.vacationId}/${store.getState().userReducer.user.userId}`);
                store.dispatch(FollowDeletedAction(props.vacation));
            }
            setExpanded(!expanded);
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
    };

    return (

        <div className="VacationUserCard" style={{ display: "inline-block", marginLeft: "30px", marginTop: "10px" }}>
            <Card className={classes.root}>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="140"
                    image={`${Globals.vacationsUrl}/image/${props.vacation.imageFileName}`}
                    title="Contemplative Reptile" />
                <CardContent>
                    <Typography variant="h5" component="p">
                        {props.vacation.destination}
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography className="description" component="p">
                        {props.vacation.description}
                    </Typography>
                </CardContent>
                <CardContent >
                    <Typography component="p">
                        From: {new Date(props.vacation.fromDate).toDateString()}
                    </Typography>
                    <Typography component="p">
                        To:{new Date(props.vacation.toDate).toDateString()}
                    </Typography>
                    <Typography component="p">
                        Price:{props.vacation.price + "$"}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Typography component="span">
                        <IconButton aria-label="add to favorites"
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={!expanded} >
                            <FavoriteIcon />
                        </IconButton >
                        Follows: {follow ? follow : 0}
                    </Typography>
                </CardActions>
            </Card>
        </div>

    );
}