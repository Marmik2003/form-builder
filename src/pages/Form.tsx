import React, { useEffect, useRef, useReducer, useState } from "react";
import { Link } from "raviger";

import { formData, formField, textFieldTypes } from "../types/form";
import { saveFormData } from "../utils/StorageUtils";

import FormLabelInput from "../components/FormLabelInput";
import FormReducer, { getNewField } from "../reducers/FormReducer";
import {
  addField,
  addOption,
  authenticateUser,
  getFormData,
  removeField,
  removeOption,
  updateFormData,
} from "../utils/APIMethods";
import LoadingComponent from "../components/LoadingComponent";

const newForm: formData = {
  id: Number(new Date()),
  name: "--------",
  description: "",
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

const Form = (props: { formId: Number }) => {
  const [loading, setLoading] = useState(true);
  const [form, dispatch] = useReducer(FormReducer, newForm);
  const [newField, setNewField] = React.useState("");
  const [fieldType, setFieldType] = React.useState<
    textFieldTypes | "select" | "multiselect" | "radio"
  >("text");

  const nameRef = useRef<HTMLInputElement>(null);

  const setForm = (formId: Number) => {
    getFormData(formId)
      .then((data) => {
        data.formFields = data.fields;
        delete data.fields;
        dispatch({ type: "SET_FORM", data });
      })
      .finally(() => setLoading(false));
  };

  const setNewFieldObject = () => {
    const new_field = getNewField(fieldType, newField);
    addField(props.formId, new_field).then((data: formField) => {
      return dispatch({
        type: "ADD_FIELD",
        newField: data,
        callback: () => {
          setNewField("");
          setFieldType("text");
        },
      });
    });
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    const oldTitle = document.title;
    document.title = "Form Builder";
    nameRef.current?.focus();
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      updateFormData(props.formId, form);
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, form.description, props.formId]);

  useEffect(() => setForm(props.formId), [props.formId]);

  return (
    <div>
      {loading && <LoadingComponent />}
      <input
        value={form.name}
        onChange={(e) =>
          dispatch({ type: "UPDATE_TITLE", name: e.target.value })
        }
        className="border border-gray-200 rounded p-2 w-full border-b-2 mb-4"
        ref={nameRef}
        aria-label="Form Title"
      />
      <div className="flex flex-col gap-4">
        {form.formFields.map((field: formField) => (
          <FormLabelInput
            formId={props.formId}
            field={field}
            removeField={(tgtId, tgtKind, tgtValue) =>
              (tgtKind === "dropdown" || tgtKind === "radio") &&
              tgtValue !== undefined
                ? removeOption(props.formId, tgtId, Number(tgtValue)).then(() =>
                    dispatch({
                      type: "REMOVE_FIELD",
                      tgtId,
                      tgtKind: tgtKind,
                      tgtValue,
                    })
                  )
                : removeField(props.formId, tgtId).then(() =>
                    dispatch({
                      type: "REMOVE_FIELD",
                      tgtId,
                      tgtKind,
                    })
                  )
            }
            key={field.id.toString()}
            setValue={(fieldKind, id, label, isOption, value) =>
              dispatch({
                type: "UPDATE_INPUT",
                fieldKind,
                fieldId: id,
                fieldLabel: label,
                isOption,
                fieldValue: value,
              })
            }
            addOption={(id: Number) =>
              addOption(props.formId, field.id, {
                id: Number(new Date()),
                text: "",
                value: "",
              }).then((data) =>
                dispatch({
                  type: "ADD_OPTION",
                  fieldId: field.id,
                  optionId: data.id,
                })
              )
            }
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
              className="min-w-max bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={setNewFieldObject}
            >
              Add Input
            </button>
          </div>
        </div>

        <div className="flex w-auto gap-2">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded"
            onClick={() => saveFormData(form)}
          >
            Save
          </button>
          <Link
            href="/"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 my-4 rounded"
          >
            Close Form
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Form;
