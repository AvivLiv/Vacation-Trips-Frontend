// Make globals url for all project
export class Globals {

    public static productsUrl: string;
    public static vacationsUrl: string;
    public static authUrl: string;
    public static usersUrl: string;
    public static followsUrl: string;
    public static socketIoUrl:string;
    
    public static init() {
        if (process.env.NODE_ENV === "production") {
            Globals.vacationsUrl = "https://vacation-trips.herokuapp.com/api/vacations/";
            Globals.authUrl = "https://vacation-trips.herokuapp.com/api/auth/";
            Globals.usersUrl = "https://vacation-trips.herokuapp.com/api/users/";
            Globals.followsUrl = "https://vacation-trips.herokuapp.com/api/follows/";
            Globals.socketIoUrl = "https://vacation-trips.herokuapp.com/";
        }
        else {
            Globals.vacationsUrl = "http://localhost:3001/api/vacations/";
            Globals.authUrl = "http://localhost:3001/api/auth/";
            Globals.usersUrl = "http://localhost:3001/api/users/";
            Globals.followsUrl = "http://localhost:3001/api/follows/";
            Globals.socketIoUrl = "http://localhost:3001/";
        }
    }
}

Globals.init();