import store from "../../../Redux/Store";
import Login from "../../UserArea/Login/Login";
import "./Home.css";

function Home(): JSX.Element {
    return (

        <div className="Home">
           {!store.getState().userReducer.user?<Login />:<h2>Welcome 
               back {store.getState().userReducer.user.firstName} {store.getState().userReducer.user.lastName}</h2>}
        </div>

    );
}

export default Home;
