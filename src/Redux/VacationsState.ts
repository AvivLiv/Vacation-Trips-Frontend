import VacationModel from "../Components/VacationsArea/Models/VacationModel";

export class VacationState {
    public vacation: VacationModel[] = [];
}

export enum VacationActionType {
    VacationDownloaded = "vacationDownloaded",
    VacationAdded = "VacationAdded",
    VacationEdited = "VacationEdited",
    VacationDeleted = "VacationDeleted",
    VacationAddedFollow = "VacationAddedFollow",
    VacationDeletedFollow = "VacationDeletedFollow",
    VacationClean = "VacationClean"
}

export interface VacationAction {
    type: VacationActionType;
    payload?: any;
}

export function VacationDownloadedAction(vacations: VacationModel[]): VacationAction {
    return { type: VacationActionType.VacationDownloaded, payload: vacations };
}
export function VacationAddedAction(vacation: VacationModel): VacationAction {
    return { type: VacationActionType.VacationAdded, payload: vacation };
}
export function VacationEditedAction(vacation: VacationModel): VacationAction {
    return { type: VacationActionType.VacationEdited, payload: vacation };
}
export function VacationDeletedAction(id: number): VacationAction {
    return { type: VacationActionType.VacationDeleted, payload: id };
}
export function FollowAddedAction(vacation: VacationModel): VacationAction {
    return { type: VacationActionType.VacationAddedFollow, payload: vacation };
}
export function FollowDeletedAction(vacation: VacationModel): VacationAction {
    return { type: VacationActionType.VacationDeletedFollow, payload: vacation };
}
export function VacationCleanAction(): VacationAction {
    return { type: VacationActionType.VacationClean };
}

export function vacationReducer(currentSate: VacationState = new VacationState(),
    action: VacationAction): VacationState {
    const newState = { ...currentSate };
    switch (action.type) {
        case VacationActionType.VacationDownloaded:
            newState.vacation = action.payload;
            newState.vacation.sort(v => v.userFollow ? -1 : 1);
            break;
        case VacationActionType.VacationAdded:
            newState.vacation.push(action.payload);
            newState.vacation.sort(v => v.userFollow ? -1 : 1);
            break;
        case VacationActionType.VacationEdited:
            const indexToUpdate = newState.vacation.findIndex(v => v.vacationId === action.payload.vacationId);
            newState.vacation[indexToUpdate] = action.payload;
            newState.vacation.sort(v => v.userFollow ? -1 : 1);
            break;
        case VacationActionType.VacationDeleted:
            const indexToDeleted = newState.vacation.findIndex(v => v.vacationId === action.payload);
            newState.vacation.splice(indexToDeleted, 1);
            newState.vacation.sort(v => v.userFollow ? -1 : 1);
            break;
        case VacationActionType.VacationAddedFollow:
            const indexToUpdateFollow = newState.vacation.findIndex(v => v.vacationId === action.payload.vacationId);
            newState.vacation[indexToUpdateFollow].userFollow = true;
            newState.vacation[indexToUpdateFollow].follows = newState.vacation[indexToUpdateFollow].follows + 1;
            newState.vacation.sort(v => v.userFollow ? -1 : 1);
            break;
        case VacationActionType.VacationDeletedFollow:
            const indexToUpdateUnFollow = newState.vacation.findIndex(v => v.vacationId === action.payload.vacationId);
            newState.vacation[indexToUpdateUnFollow].userFollow = false;
            newState.vacation[indexToUpdateUnFollow].follows = newState.vacation[indexToUpdateUnFollow].follows - 1;
            newState.vacation.sort(v => v.userFollow ? -1 : 1);
            break;
        case VacationActionType.VacationClean:
            newState.vacation = [];
            break;

            
    }
    return newState;
}
