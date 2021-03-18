import { Button } from "@material-ui/core";
import "./Logout.css";
import { useHistory } from "react-router-dom";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { logoutUser } from "../../../Services/GlobalAuth";

function Logout(): JSX.Element {

    const btStyle = { margin: '8px 0', marginTop: "10px" }

    const history = useHistory();
    
    let user = JSON.parse(sessionStorage.getItem("user"));

    const logout = () => {
        logoutUser();
        history.push("/home");
    }

    return (

        <div className="Logout">
            {user ? <Button color="secondary" variant="contained" style={btStyle}
                fullWidth onClick={logout}>Logout <MeetingRoomIcon fontSize="small" /></Button> : null}
        </div>

    );
}

export default Logout;
