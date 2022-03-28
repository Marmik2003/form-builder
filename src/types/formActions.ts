import { textFieldTypes } from "./form";

type AddAction = {
    type: "ADD_FIELD";
    fieldType: textFieldTypes | "select" | "multiselect" | "radio";
    newField: string;
    callback: () => void;
}

type RemoveAction = {
    type: "REMOVE_FIELD";
    tgtKind: "text" | "dropdown" | "radio";
    tgtValue?: string;
    tgtId: Number;
}

type UpdateTitleAction = {
    type: "UPDATE_TITLE";
    title: string;
}

type UpdateInputAction = {
    type: "UPDATE_INPUT";
    fieldKind?: "text" | "dropdown" | "radio";
    fieldId: Number;
    fieldLabel: string;
    isOption?: boolean;
    fieldValue?: string;
}

type RemoveInputAction = {
    type: "REMOVE_INPUT";
    fieldId: Number;
    fieldValue?: string;
}

type AddOptionAction = {
    type: "ADD_OPTION";
    fieldId: Number;
}


export type FormAction = AddAction | RemoveAction | UpdateTitleAction | UpdateInputAction | RemoveInputAction | AddOptionAction;
