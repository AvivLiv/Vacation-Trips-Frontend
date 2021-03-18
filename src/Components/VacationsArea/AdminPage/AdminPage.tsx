import "./AdminPage.css";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import store from "../../../Redux/Store";
import { Unsubscribe } from "redux";
import { useHistory } from "react-router-dom";
import { getRandomColor } from "../../../Services/GlobalRandomColor";

interface adminModel {
    follows: number;
    destination: string;
    color: string;
}

const AdminPage = () => {

    const history = useHistory();

    let vacations: adminModel[] = [];

    // Get all vacation from redux that have follows
    store.getState().vacationReducer.vacation.map(v => v.follows ? vacations.push({ follows: v.follows, destination: v.destination, color: getRandomColor() }) : null);

    const [vacationFollowers, setVacationFollowers] = useState<adminModel[]>(vacations);

     // Listening to change on redux
    useEffect(() => {
        if (!store.getState().userReducer.user.isAdmin || vacations.length === 0) {
            history.push("/vacations");
            return;
        }
        const unSubscribe: Unsubscribe = store.subscribe(() => {
            const vacationFollowers = [];
            store.getState().vacationReducer.vacation.map(v => v.follows ? vacationFollowers.push({ follows: v.follows, destination: v.destination, color: getRandomColor() }) : null);
            setVacationFollowers(vacationFollowers);
        })
        return unSubscribe;
    }, [])

    return (

        <div className="AdminPage">
            <Bar 
                data={{
                    labels: vacationFollowers.map(v => v.destination),
                    datasets: [{
                        label: '# of Vacation',
                        data: vacationFollowers.map(v => v.follows),
                        backgroundColor: vacationFollowers.map(v => v.color),
                        borderColor: vacationFollowers.map(v => v.color),
                        borderWidth: 1,
                        color:"black"
                    },]
                }}
                height={300}
                width={400}
                options={{
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                
                                }
                            }
                        ]
                    }
                }}
            />
        </div>

    );
}

export default AdminPage;
