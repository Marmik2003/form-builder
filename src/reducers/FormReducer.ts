import { formData, formField, selectField, textFieldTypes } from "../types/form";
import { FormAction } from "../types/formActions";

export const getNewField: (
  fieldType: textFieldTypes | "select" | "multiselect" | "radio",
  newField: string
) => formField = (fieldType, newField) => {
  switch (fieldType) {
    case "select":
      return {
        id: Number(new Date()),
        label: newField,
        type: fieldType,
        options: [],
        kind: "dropdown",
      };
    case "multiselect":
      return {
        id: Number(new Date()),
        label: newField,
        type: "select",
        options: [],
        kind: "dropdown",
        multiple: true,
      };
    case "radio":
      return {
        id: Number(new Date()),
        label: newField,
        type: "select",
        kind: "radio",
        options: [],
      };
    default:
      return {
        id: Number(new Date()),
        label: newField,
        value: "",
        type: fieldType,
        kind: "text",
      };
  }
};

const reducer: (state: formData, action: FormAction) => formData = (
  state,
  action
) => {
  switch (action.type) {
    case "SET_FORM":
      return action.data;
    case "ADD_FIELD":
      action.callback();
      return {
        ...state,
        formFields: [...state.formFields, action.newField],
      };
    case "REMOVE_FIELD":
      if (action.tgtValue !== undefined && (action.tgtKind === "dropdown" || action.tgtKind === "radio")) {
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if (field.id === action.tgtId) {
              (field as selectField).options = (
                field as selectField
              ).options.filter((option) => option.id !== Number(action.tgtValue));
            }
            return field;
          }),
        };
      } else {
        return {
          ...state,
          formFields: state.formFields.filter(
            (field) => field.id !== action.tgtId
          ),
        };
      }
    case "UPDATE_TITLE":
      return {
        ...state,
        name: action.name,
      };
    case "UPDATE_INPUT":
      if (
        action.isOption &&
        (action.fieldKind === "dropdown" || action.fieldKind === "radio")
      ) {
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if (field.id === action.fieldId) {
              return {
                ...field,
                options: (field as selectField).options.map((option) => {
                  if (option.id.toString() === action.fieldValue) {
                    return {
                      ...option,
                      text: action.fieldLabel,
                    };
                  }
                  return option;
                }),
              };
            }
            return field;
          }),
        };
      } else {
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if (field.id === action.fieldId) {
              return {
                ...field,
                label: action.fieldLabel,
              };
            }
            return field;
          }),
        };
      }
    case "ADD_OPTION":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.fieldId) {
            return {
              ...field,
              options: [
                ...(field as selectField).options,
                {
                  id: action.optionId,
                  text: "",
                },
              ],
            };
          }
          return field;
        }),
      };
    default:
      return state;
  }
};

export default reducer;
