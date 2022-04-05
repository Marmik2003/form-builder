import { formField } from "./form";

type GetForm = {
    type: 'GET_FORM';
    formFields: formField[];
};

type UpdateSingleValue = {
    type: 'UPDATE_VALUE';
    value: string;
    id: Number;
};

type UpdateMultiValue = {
    type: 'UPDATE_MULTI_VALUE';
    value: string[];
    id: Number;
};

export type PreviewAction = GetForm | UpdateSingleValue | UpdateMultiValue;
