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

export type PreviewAction = UpdateSingleValue | UpdateMultiValue;
