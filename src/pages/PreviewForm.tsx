import React, { useState } from "react";
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

const getForm: (formId: Number) => formData | undefined = (formId) => {
  const forms = getLocalForms();
  const form = forms.find((form: formData) => form.id === formId);
  if (!form) {
    navigate("/");
  } else {
    return form;
  }
};

const PreviewForm = (props: { formId: Number }) => {
  const form = getForm(props.formId);
  const [formFields, setFormFields] = useState<formField[]>(
    form?.formFields ?? []
  );
  const [currentField, setCurrentField] = useState<formField>(formFields[0]);

  const getFormField = (fieldId: Number) => {
    return formFields.find((field: formField) => field.id === fieldId);
  };

  const isNextField = () => {
    const field = getFormField(currentField.id);
    if (field) {
      const idx = formFields.indexOf(field);
      if (idx < formFields.length - 1) {
        return true;
      }
    }
    return false;
  };

  const isPreviousField = () => {
    const field = getFormField(currentField.id);
    if (field) {
      const idx = formFields.indexOf(field);
      if (idx > 0) {
        return true;
      }
    }
    return false;
  };

  const getNextField = () => {
    const field = getFormField(currentField.id);
    if (field) {
      const idx = formFields.indexOf(field);
      if (idx < formFields.length - 1) {
        setCurrentField(formFields[idx + 1]);
      }
    }
  };

  const getPreviousField = () => {
    const field = getFormField(currentField.id);
    if (field) {
      const idx = formFields.indexOf(field);
      if (idx > 0) {
        setCurrentField(formFields[idx - 1]);
      }
    }
  };

  const handleFieldValueChange = (value: string) => {
    setFormFields((formFields: formField[]) => {
      return formFields.map((field: formField) => {
        if (field.id === currentField.id) {
          field.value = value;
        }
        return field;
      });
    });
  };

  const handleFieldMultiValueChange = (value: string[]) => {
    const field = getFormField(currentField.id);
    if (field) {
      setFormFields(
        formFields.map((field: formField) => {
          if (field.id === currentField.id) {
            field.value = value;
          }
          return field;
        })
      );
    }
  };

  const renderField = () => {
    const field = getFormField(currentField.id);
    if (field) {
      switch (field.kind) {
        case "text":
          return field.type === "textarea" ? (
            <textarea
              className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
              id={currentField.id.toString()}
              name={currentField.label}
              placeholder={currentField.label}
              value={(currentField as textField).value}
              onChange={(e) => {
                handleFieldValueChange(e.target.value);
              }}
            />
          ) : (
            <input
              className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
              id={currentField.id.toString()}
              name={currentField.label}
              placeholder={currentField.label}
              value={(currentField as textField).value}
              type={currentField.type}
              onChange={(e) => {
                handleFieldValueChange(e.target.value);
              }}
            />
          );
        case "dropdown":
          return (
            <select
              className="block appearance-none w-full bg-slate-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id={currentField.id.toString()}
              name={currentField.label}
              value={(currentField as selectField).value}
              onChange={(e) => {
                (currentField as selectField).multiple
                  ? handleFieldMultiValueChange(
                      Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      )
                    )
                  : handleFieldValueChange(e.target.value);
              }}
              multiple={(currentField as selectField).multiple}
            >
              {field.options.map((option: optionField) => {
                return (
                  <option key={option.value} value={option.text}>
                    {option.text}
                  </option>
                );
              })}
            </select>
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
        {currentField ? (
          <>
            <div className="preview-form__content__item">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-search"
              >
                {currentField.label}
              </label>
              {renderField()}
            </div>
            <div className="flex justify-end w-full gap-2">
              {isPreviousField() && (
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded"
                  onClick={getPreviousField}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Previous
                </button>
              )}
              {isNextField() && (
                <button
                  onClick={getNextField}
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
