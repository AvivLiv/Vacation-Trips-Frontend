import axios from "axios";
import { Component } from "react";
import VacationModel from "../Models/VacationModel";
import store from "../../../Redux/Store";
import "./VacationsList.css";
import UserModel from "../../UserArea/Models/UserModel";
import VacationUserCard from "../VacationUserCard/VacationUserCard";
import VacationAdminCard from "../VacationAdminCard/VacationAdminCard";
import { VacationDownloadedAction } from "../../../Redux/VacationsState";
import { Globals } from "../../../Services/Global";
import { Unsubscribe } from "redux";
import { History } from "history";
import { RouteComponentProps } from "react-router-dom";
import { errorsService } from "../../../Services/GlobalError";
import { logoutUser } from "../../../Services/GlobalAuth";

interface VacationsListState {
    vacations: VacationModel[];
    userLogin: UserModel;
}

interface VacationsListProps extends RouteComponentProps {
    history: History;
}

class VacationsList extends Component<VacationsListProps, VacationsListState> {

    private unsubscribeFromStore: Unsubscribe;

    public constructor(props: VacationsListProps) {
        super(props);
        this.state = { vacations: store.getState().vacationReducer.vacation, userLogin: store.getState().userReducer.user };
    }

    // Get all vacations from server, and save in redux
    public async componentDidMount() {
        try {
            this.unsubscribeFromStore = store.subscribe(() => {
                const vacations = store.getState().vacationReducer.vacation;
                this.setState({ vacations });
            });
            if (store.getState().vacationReducer.vacation.length === 0) {
                const response = await axios.get<VacationModel[]>(Globals.vacationsUrl);
                const vacations = response.data;
                store.dispatch(VacationDownloadedAction(vacations));
            }
        }
        catch (err) {
            if (err.response?.status === 403) {
                logoutUser();
                this.props.history.push("/home");
                alert(errorsService.getError(err));
            }
            else {
                alert(errorsService.getError(err));
            }
        }
    }

    public render(): JSX.Element {

        return (

            <div className="VacationsList">
                <h2>Our Vacations</h2>
                {this.state.userLogin && this.state.userLogin.isAdmin === 1 ?
                    this.state.vacations.map(v => <VacationAdminCard key={v.vacationId} vacation={v} />) :
                    this.state.vacations.map(v => <VacationUserCard key={v.vacationId} vacation={v} />)}
            </div>

        );
    }

    // finish ths subscribe
    public componentWillUnmount(): void {
        this.unsubscribeFromStore();
    }
}

export default VacationsList;
