import React, { Key, useEffect } from "react";
import { formField, selectField } from "../types/form";
import { updateField, updateOption } from "../utils/APIMethods";

interface formInputProps {
  formId: Number;
  field: formField;
  removeField: (tgtId: Number, tgtKind: "text" | "dropdown" | "radio", tgtValue?: string) => void;
  value?: string;
  setValue: (fieldKind: "text" | "dropdown" | "radio", id: Number, label:string, isOption?: boolean, fieldValue?: string) => void;
  addOption: (fieldId: Number) => void;
}

const renderInput = (
  field: formField,
  removeField: (tgtId: Number, tgtKind: "text" | "dropdown" | "radio", tgtValue?: string) => void,
  setValue: (fieldKind: "text" | "dropdown" | "radio", id: Number, label:string, isOption?: boolean, fieldValue?: string) => void,
  addOption: (fieldId: Number) => void,
) => {

  switch (field.type) {
    case "text":
      return (
        <div className="flex gap-2 w-full px-2">
          <input
            type={field.type}
            id={field.id.toString()}
            placeholder={field.label}
            value={field.label}
            onChange={(e) => setValue(field.kind, field.id, e.target.value)}
            className="border border-gray-200 rounded p-2 w-full"
          />
          <button
            type="button"
            className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeField(field.id, field.kind)}
          >
            Remove
          </button>
        </div>
      );
    case "select":
      return (
        <div className="flex flex-col gap-2 w-full px-2 border border-dotted border-y">
          <p className="font-medium">Label</p>
          <div className="flex gap-2">
            <input
              type="text"
              id={`label${field.id}`}
              placeholder={field.label}
              value={field.label}
              onChange={(e) => setValue(field.kind, field.id, e.target.value)}
              className="border border-gray-200 rounded p-2 w-full"
              aria-label="Edit label"
            />
            <button
              type="button"
              className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => removeField(field.id, field.kind)}
            >
              Remove
            </button>
          </div>

          {field.options.length > 0 ? (
            <p className="font-medium">Options</p>
          ) : (
            <p className="font-medium">No options</p>
            )}
          {field.options.map((option) => (
            <div className="flex gap-2" key={option.id as Key}>
              <input
                type="text"
                id={`option${option.id}`}
                placeholder={option.text}
                value={option.text}
                onChange={(e) => setValue(field.kind, field.id, e.target.value, true, option.id.toString())}
                className="border border-gray-200 rounded p-2 w-full"
              />
              <button
                type="button"
                className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => removeField(field.id, field.kind, option.id.toString())}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mb-3"
            onClick={() => addOption(field.id)}
          >
            Add Option
          </button>
        </div>
      );
    default:
      return (
        <>
          <input
            type="text"
            id={field.id.toString()}
            placeholder={field.label}
            value={field.label}
            onChange={(e) => setValue(field.kind, field.id, e.target.value)}
            className="border border-gray-200 rounded p-2 w-full"
          />
          <button
            type="button"
            className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeField(field.id, field.kind )}
          >
            Remove
          </button>
        </>
      );
  }
};

const FormLabelInput = ({ formId, field, removeField, setValue, addOption }: formInputProps) => {
  useEffect(() => {
    let timeout = setTimeout(async () => {
        await updateField(formId, field.id!, field);
    }, 1000);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.label, formId]);

  useEffect(() => {
    let timeout = setTimeout(async () => {
      if ((field as selectField).options) {
        await (field as selectField).options.forEach((option) => {
          updateOption(formId, field.id, option.id, option);
        });
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [field, formId]);


  return (
    <div className="flex flex-col" key={field.id.toString()}>
      <label className="pb-2" htmlFor={field.id.toString()}>
        {field.label} ({field.kind !== "radio" ? field.type : field.kind}{(field as selectField).multiple && " - multiple"})
      </label>
      <div className="flex gap-2">
        {renderInput(field, removeField, setValue, addOption)}
      </div>
    </div>
  );
};

export default FormLabelInput;
