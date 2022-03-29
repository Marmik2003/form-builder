import React, { useReducer, useState } from "react";
import { navigate } from "raviger";

import {
  formData,
  formField,
  optionField,
  selectField,
  textField,
} from "../types/form";
import { getLocalForms } from "../utils/StorageUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { PreviewAction } from "../types/previewActions";
import { MultiSelect } from "react-multi-select-component";

const getForm: (formId: Number) => formData | undefined = (formId) => {
  const forms = getLocalForms();
  const form = forms.find((form: formData) => form.id === formId);
  if (!form) {
    navigate("/");
  } else {
    return form;
  }
};


const reducer: (state: formField[], action: PreviewAction) => formField[] = (state, action) => {
  switch (action.type) {
    case "UPDATE_VALUE":
      return state.map((field: formField) => {
        if (field.id === action.id) {
          return { ...field, value: action.value };
        } else {
          return field;
        }
      });
    case "UPDATE_MULTI_VALUE":
      return state.map((field: formField) => {
        if (field.id === action.id) {
          return { ...(field as selectField), value: action.value };
        } else {
          return field;
        }
      });
    }
};


const PreviewForm = (props: { formId: Number }) => {
  const form = getForm(props.formId);

  const [formFields, dispatch] = useReducer(reducer, null, () => form?.formFields ?? []);
  const [currentFieldIdx, setCurrentFieldIdx] = useState(0);

  const getCurrentField = () => {
    if (formFields.length > 0) {
      return formFields[currentFieldIdx];
    }
    navigate("/");
  };

  const renderField = (field: formField | undefined) => {
    if (field) {
      switch (field.kind) {
        case "text":
          return field.type === "textarea" ? (
            <textarea
              className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
              id={field.id.toString()}
              name={field.label}
              placeholder={field.label}
              value={(field as textField).value}
              onChange={(e) => {
                dispatch({ type: "UPDATE_VALUE", id: field.id, value: e.target.value });
              }}
            />
          ) : (
            <input
              className="block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
              id={field.id.toString()}
              name={field.label}
              placeholder={field.label}
              value={(field as textField).value}
              type={field.type}
              onChange={(e) => {
                dispatch({ type: "UPDATE_VALUE", id: field.id, value: e.target.value });
              }}
            />
          );
        case "dropdown":
          return (
            (field as selectField).multiple ? (
              <MultiSelect
                options={(field as selectField).options.map((option: optionField) => ({
                  label: option.text,
                  value: option.value,
                }))}
                value={(field as selectField).value ? (((field as selectField).value as string[]).map((value: string) => ({
                  value,
                  label: (field as selectField).options.find((option: optionField) => option.value === value)?.text ?? "",
                }))) : []}
                labelledBy={field.label}
                onChange={(values: any) => {
                  dispatch({ type: "UPDATE_MULTI_VALUE", id: field.id, value: values.map((value: any) => value.value) });
                }}
              />
            ) : (
              <select
                className="block w-full bg-slate-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
                id={field.id.toString()}
                name={field.label}
                value={(field as selectField).value}
                onChange={(e) => {
                  (field as selectField).multiple
                    ? dispatch({ type: "UPDATE_MULTI_VALUE", id: field.id, value: Array.from(e.target.selectedOptions, (option) => option.value) })
                    : dispatch({ type: "UPDATE_VALUE", id: field.id, value: e.target.value });
                }}
              >
                {field.options.map((option: optionField) => {
                  return (
                    <option key={option.value} value={option.text}>
                      {option.text}
                    </option>
                  );
                })}
              </select>
            )
          );
        case "radio":
          return (
            <div className="flex flex-col">
              {field.options.map((option: optionField) => {
                return (
                  <label
                    key={option.value}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <input
                      className="mr-2 leading-tight"
                      type={field.kind}
                      name={field.label}
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={(e) => {
                        dispatch({ type: "UPDATE_VALUE", id: field.id, value: e.target.value });
                      }}
                    />
                    {option.text}
                  </label>
                );
              })}
            </div>
          );
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex w-full my-3">
        <h2 className="text-3xl font-semibold">Preview</h2>
      </div>
      <div className="flex flex-col">
        {formFields.length > currentFieldIdx ? (
          <>
            <div className="preview-form__content__item">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-search"
              >
                {getCurrentField()?.label}
              </label>
              {renderField(getCurrentField())}
            </div>
            <div className="flex justify-end w-full gap-2">
              {currentFieldIdx > 0 && (
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded"
                  onClick={() => setCurrentFieldIdx(currentFieldIdx - 1)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Previous
                </button>
              )}
              {currentFieldIdx < formFields.length - 1 && (
                <button
                  onClick={() => setCurrentFieldIdx(currentFieldIdx + 1)}
                  className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-4 my-4 rounded"
                >
                  Next <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <p className="text-center">No fields to preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewForm;
