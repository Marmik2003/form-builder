import React, { useEffect, useRef, useReducer } from "react";
import { Link, navigate } from "raviger";

import {
  formData,
  formField,
  selectField,
  textFieldTypes,
} from "../types/form";
import { getInitialState, saveFormData } from "../utils/StorageUtils";

import FormLabelInput from "../components/FormLabelInput";
import { FormAction } from "../types/formActions";

const newForm: formData = {
  id: Number(new Date()),
  title: "Untitled Form",
  formFields: [],
};

const fieldTypes = [
  {
    label: "Text",
    value: "text",
  },
  {
    label: "Dropdown",
    value: "select",
  },
  {
    label: "Multi-Select",
    value: "multiselect",
  },
  {
    label: "Radio",
    value: "radio",
  },
  {
    label: "Date",
    value: "date",
  },
  {
    label: "Time",
    value: "time",
  },
  {
    label: "Number",
    value: "number",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Phone",
    value: "tel",
  },
  {
    label: "Textarea",
    value: "textarea",
  },
  {
    label: "Password",
    value: "password",
  },
];

const getNewField: (
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

// Action Reducers
const reducer: (state: formData, action: FormAction) => formData = (state, action) => {
  switch (action.type) {
    case "ADD_FIELD":
      const newField = getNewField(action.fieldType, action.newField);
      action.callback();
      return {
        ...state,
        formFields: [...state.formFields, newField],
      };
    case "REMOVE_FIELD":
      if(action.tgtValue !== undefined && action.tgtKind === "dropdown") {
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if(field.id === action.tgtId) {
              (field as selectField).options = (field as selectField).options.filter(option => option.value !== action.tgtValue);
            }
            return field;
          })
        }
      } else {
        return {
          ...state,
          formFields: state.formFields.filter((field) => field.id !== action.tgtId)
        }
      }
    case "UPDATE_TITLE":
      return {
        ...state,
        title: action.title,
      }
    case "UPDATE_INPUT":
      if (action.isOption && (action.fieldKind === "dropdown" || action.fieldKind === "radio")) {
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if (field.id === action.fieldId) {
              return {
                ...field,
                options: (field as selectField).options.map((option) => {
                  if (option.value === action.fieldValue) {
                    return {
                      ...option,
                      text: action.fieldLabel,
                    };
                  }
                  return option;
                })
              }
            }
            return field;
          })
        }
      } else {
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if (field.id === action.fieldId) {
              return {
                ...field,
                label: action.fieldLabel,
              }
            }
            return field;
          })
        }
      }
    case "REMOVE_INPUT":
      if (action.fieldValue) {
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if (field.id === action.fieldId) {
              return {
                ...field,
                options: (field as selectField).options.filter(option => option.value !== action.fieldValue)
              }
            }
            return field;
          })
        }
      } else {
        return {
          ...state,
          formFields: state.formFields.filter((field) => field.id !== action.fieldId)
        }
      }
    case "ADD_OPTION":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.fieldId) {
            return {
              ...field,
              options: [...(field as selectField).options, {
                value: Number(new Date()).toString(),
                text: "",
              }]
            }
          }
          return field;
        })
      }
    default:
      return state;
    }

};


const Form = (props: { formId?: Number }) => {
  const [form, dispatch] = useReducer(reducer, null, () => getInitialState(newForm, props.formId));
  const [newField, setNewField] = React.useState("");
  const [fieldType, setFieldType] = React.useState<
    textFieldTypes | "select" | "multiselect" | "radio"
  >("text");

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const oldTitle = document.title;
    document.title = "Form Builder";
    titleRef.current?.focus();
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveFormData(form);
    }, 300);
    return () => clearTimeout(timeout);
  }, [form]);

  useEffect(() => {
    form.id !== props.formId && navigate(`/form/${form.id}`);
  }, [form.id, props.formId]);

  return (
    <div>
      <input
        value={form.title}
        onChange={(e) => dispatch({ type: "UPDATE_TITLE", title: e.target.value })}
        className="border border-gray-200 rounded p-2 w-full border-b-2 mb-4"
        ref={titleRef}
      />
      <div className="flex flex-col gap-4">
        {form.formFields.map((field: formField) => (
          <FormLabelInput
            field={field}
            removeField={(tgtId, tgtKing, tgtValue) => dispatch({ type: "REMOVE_FIELD", tgtId, tgtKind: tgtKing, tgtValue })}
            key={field.id.toString()}
            setValue={(fieldKind, id, label, isOption, value) => dispatch({
              type: "UPDATE_INPUT",
              fieldKind,
              fieldId: id,
              fieldLabel: label,
              isOption,
              fieldValue: value,
            })}
            addOption={(id) => dispatch({
              type: "ADD_OPTION",
              fieldId: id,
            })}
          />
        ))}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <input
              type="text"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
              className="border border-gray-200 rounded p-2 w-full"
              placeholder="Add a field"
            />
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value as textFieldTypes)}
              className="border border-gray-200 rounded p-2"
            >
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="min-w-max bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => dispatch({ type: "ADD_FIELD", fieldType, newField, callback: () => setNewField("") })}
            >
              Add Input
            </button>
          </div>
        </div>

        <div className="flex w-auto gap-2">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded"
            onClick={() => saveFormData(form)}
          >
            Save
          </button>
          <Link
            href="/"
            className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 my-4 rounded"
          >
            Close Form
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Form;
