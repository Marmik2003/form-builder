import { formData, formField } from "./form";

type SetFormAction = {
  type: "SET_FORM";
  data: formData;
};

type AddAction = {
  type: "ADD_FIELD";
  newField: formField;
  callback: () => void;
};

type RemoveAction = {
  type: "REMOVE_FIELD";
  tgtKind: "text" | "dropdown" | "radio";
  tgtValue?: string;
  tgtId: Number;
};

type UpdateTitleAction = {
  type: "UPDATE_TITLE";
  name: string;
};

type UpdateInputAction = {
  type: "UPDATE_INPUT";
  fieldKind: "text" | "dropdown" | "radio";
  fieldId: Number;
  fieldLabel: string;
  isOption?: boolean;
  fieldValue?: string;
};

type AddOptionAction = {
  type: "ADD_OPTION";
  fieldId: Number;
  optionId: Number;
};

export type FormAction =
  | SetFormAction
  | AddAction
  | RemoveAction
  | UpdateTitleAction
  | UpdateInputAction
  | AddOptionAction;
