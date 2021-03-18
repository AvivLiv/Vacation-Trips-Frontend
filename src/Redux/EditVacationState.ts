export class EditVacationState {

    public EditVacationId: number = 0;

    constructor() {
        const EditVacationId = JSON.parse(sessionStorage.getItem("EditVacationId"));
        if (EditVacationId) {
            this.EditVacationId = EditVacationId;
        }
    }
    
}

export enum EditVacationActionType {
    EditVacationId = "VacationId",
    EditVacationClean="EditVacationClean"
}

export interface EditVacationAction {
    type: EditVacationActionType;
    payload?: any;
}

export function EditVacationIdAction(id: number): EditVacationAction {
    return { type: EditVacationActionType.EditVacationId, payload: id };
}
export function EditVacationCleanAction(): EditVacationAction {
    return { type: EditVacationActionType.EditVacationClean };
}

export function editVacationReducer(currentSate: EditVacationState = new EditVacationState(),
    action: EditVacationAction): EditVacationState {
    const newState = { ...currentSate };
    switch (action.type) {
        case EditVacationActionType.EditVacationId:
            newState.EditVacationId = action.payload;
            break;
            case EditVacationActionType.EditVacationClean:
            newState.EditVacationId = 0;
            break;
    }
    return newState;
}