import "./App.css";
import VacationTab from "../VacationTab/VacationTab";
import { useEffect } from "react";
import store from "../../../Redux/Store";
import { socketManagerInstance } from "../../../Socket.io/SocketManager";

function App(): JSX.Element {

    // start listening to socket.io
    useEffect(() => {
        if (store.getState().userReducer.user) {
            socketManagerInstance.connect()
        }
    })

    return (

        <div className="App">
            <h1 style={{ marginTop: "15vh" }}>Vacation Trips</h1>
            <VacationTab />
        </div>

    );
}

export default App;
