class VacationModel {

    public vacationId: number;
    public destination: string;
    public description: string;
    public fromDate: string;
    public toDate: string;
    public price: number;
    public imageFileName: string;
    public image: FileList;
    public follows: number;
    public userFollow:boolean;

}

export default VacationModel;