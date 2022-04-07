import { formField, selectField } from "../types/form";
import { PreviewAction } from "../types/previewActions";

const reducer: (state: formField[], action: PreviewAction) => formField[] = (
  state,
  action
) => {
  switch (action.type) {
    case "GET_FORM":
      return action.formFields;
    case "UPDATE_VALUE":
      console.log(action.value);
      return state.map((field: formField) => {
        if (field.id === action.id) {
          return { ...field, value: action.value };
        } else {
          return field;
        }
      });
    case "UPDATE_MULTI_VALUE":
      console.log(action.value);
      return state.map((field: formField) => {
        if (field.id === action.id) {
          return { ...(field as selectField), value: action.value };
        } else {
          return field;
        }
      });
  }
};

export default reducer;
