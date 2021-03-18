import { io, Socket } from "socket.io-client";
import VacationModel from "../Components/VacationsArea/Models/VacationModel";
import store from "../Redux/Store";
import { VacationAddedAction, VacationDeletedAction, VacationEditedAction } from "../Redux/VacationsState";
import { Globals } from "../Services/Global";

class SocketManager {

    private socket: Socket;

    public connect(): void {

        // Connect to socket.io:
        this.socket = io(Globals.socketIoUrl);

        // Listen to socket.io events:

        this.socket.on("msg-from-server-vacation-added", (addedVacation: VacationModel) => {
            store.dispatch(VacationAddedAction(addedVacation));
        });

        this.socket.on("msg-from-server-vacation-updated", (updatedVacation: VacationModel) => {
            store.dispatch(VacationEditedAction(updatedVacation));
        });

        this.socket.on("msg-from-server-vacation-deleted", (id: number) => {
            store.dispatch(VacationDeletedAction(id))
        });

    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}

export default SocketManager;

export const socketManagerInstance = new SocketManager();