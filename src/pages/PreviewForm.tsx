import React, { Key, useEffect, useReducer, useState } from "react";
import { navigate } from "raviger";

import { formField, optionField, selectField, textField } from "../types/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "react-multi-select-component";
import PreviewReducer from "../reducers/PreviewReducer";
import {
  getFormData,
  getSubmission,
  submitForm,
} from "../utils/APIMethods";
import LoadingComponent from "../components/LoadingComponent";
import { toast } from "react-toastify";

const PreviewForm = (props: { formId: Number; previewId?: Number }) => {
  const [loading, setLoading] = useState(true);

  const [formFields, dispatch] = useReducer(PreviewReducer, []);
  const [currentFieldIdx, setCurrentFieldIdx] = useState(0);

  useEffect(() => {
    getFormData(props.formId)
      .then((data) => {
        if (props.previewId) {
          getSubmission(props.formId, props.previewId).then((submission) => {
            data.fields = data.fields.map((field: formField) => {
              submission.fields.forEach((submissionField: any) => {
                if (field.id === submissionField.field.id) {
                  if (field.kind === "dropdown" && field.multiple) {
                    field.value = submissionField.value.split(",");
                  } else {
                    field.value = submissionField.value;
                  }
                }
              });
              return field;
            });
            console.log(data);
            dispatch({ type: "GET_FORM", formFields: data.fields });
          });
        } else {
          dispatch({
            type: "GET_FORM",
            formFields: data.fields,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [props.formId, props.previewId]);

  const getCurrentField = () => {
    if (formFields.length > 0) {
      return formFields[currentFieldIdx];
    }
    navigate("/");
  };

  const submitPreviewForm = () => {
    setLoading(true);
    const fieldData = formFields.map((field) => {
      return {
        field: field.id,
        value: field.value?.toString() ?? "",
      };
    });
    const submissionData = {
      fields: fieldData,
    };
    submitForm(props.formId, submissionData)
      .then((_) => {
        toast("Form successfully submitted!", {
          type: toast.TYPE.SUCCESS,
        });
        navigate("/");
      })
      .catch((error) => {
        toast(error.message, {
          type: toast.TYPE.ERROR,
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
              value={(field as textField).value ?? ""}
              onChange={(e) => {
                dispatch({
                  type: "UPDATE_VALUE",
                  id: field.id,
                  value: e.target.value,
                });
              }}
            />
          ) : (
            <input
              className="block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
              id={field.id.toString()}
              name={field.label}
              placeholder={field.label}
              value={(field as textField).value ?? ""}
              type={field.type}
              onChange={(e) => {
                dispatch({
                  type: "UPDATE_VALUE",
                  id: field.id,
                  value: e.target.value,
                });
              }}
            />
          );
        case "dropdown":
          return (field as selectField).multiple ? (
            <MultiSelect
              options={(field as selectField).options.map(
                (option: optionField) => ({
                  label: option.text,
                  value: option.id.toString(),
                })
              )}
              value={
                (field as selectField).value
                  ? ((field as selectField).value as string[]).map(
                      (value: string) => ({
                        value,
                        label:
                          (field as selectField).options.find(
                            (option: optionField) =>
                              option.id.toString() === value
                          )?.text ?? "",
                      })
                    )
                  : []
              }
              labelledBy={field.label}
              onChange={(values: any) => {
                dispatch({
                  type: "UPDATE_MULTI_VALUE",
                  id: field.id,
                  value: values.map((value: any) => value.value),
                });
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
                  ? dispatch({
                      type: "UPDATE_MULTI_VALUE",
                      id: field.id,
                      value: Array.from(e.target.selectedOptions, (option) =>
                        option.id.toString()
                      ),
                    })
                  : dispatch({
                      type: "UPDATE_VALUE",
                      id: field.id,
                      value: e.target.value,
                    });
              }}
            >
              {field.options.map((option: optionField) => {
                return (
                  <option key={option.id as Key} value={option.id.toString()}>
                    {option.text}
                  </option>
                );
              })}
            </select>
          );
        case "radio":
          return (
            <div className="flex flex-col">
              {field.options.map((option: optionField) => {
                return (
                  <label
                    key={option.id as Key}
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    <input
                      className="mr-2 leading-tight"
                      type={field.kind}
                      name={field.label}
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={(e) => {
                        dispatch({
                          type: "UPDATE_VALUE",
                          id: field.id,
                          value: e.target.value,
                        });
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
      {loading && <LoadingComponent />}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded"
                  onClick={() => setCurrentFieldIdx(currentFieldIdx - 1)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Previous
                </button>
              )}
              {currentFieldIdx < formFields.length - 1 && (
                <button
                  onClick={() => setCurrentFieldIdx(currentFieldIdx + 1)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 my-4 rounded"
                >
                  Next <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
              {!props.previewId && currentFieldIdx === formFields.length - 1 && (
                <button
                  onClick={submitPreviewForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded"
                >
                  Submit
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
