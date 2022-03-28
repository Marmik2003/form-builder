import React from "react";
import { formField, optionField, selectField } from "../types/form";
import { FormAction } from "../types/formActions";

interface formInputProps {
  field: formField;
  removeField: (action: FormAction) => void;
  value?: string;
  setValue: (fieldKind: "text" | "dropdown" | "radio", id: Number, label:string, isOption?: boolean, fieldValue?: string) => void;
  addOption: (fieldId: Number) => void;
}

const renderInput = (
  field: formField,
  removeField: (action: FormAction) => void,
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
            className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeField({ type: "REMOVE_FIELD", tgtId: field.id, tgtKind: field.kind })}
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
              id={field.id.toString()}
              placeholder={field.label}
              value={field.label}
              onChange={(e) => setValue(field.kind, field.id, e.target.value)}
              className="border border-gray-200 rounded p-2 w-full"
            />
            <button
              type="button"
              className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => removeField({ type: "REMOVE_FIELD", tgtId: field.id, tgtKind: field.kind })}
            >
              Remove
            </button>
          </div>

          {field.options.length > 0 ? (
            <p className="font-medium">Options</p>
          ) : (
            <p className="font-medium">No options</p>
            )}
          {field.options.map((option: optionField) => (
            <div className="flex gap-2" key={option.value}>
              <input
                type="text"
                id={option.value}
                placeholder={option.text}
                value={option.text}
                onChange={(e) => setValue(field.kind, field.id, e.target.value, true, option.value)}
                className="border border-gray-200 rounded p-2 w-full"
              />
              <button
                type="button"
                className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => removeField({ type: "REMOVE_FIELD", tgtId: field.id, tgtKind: field.kind, tgtValue: option.value })}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mb-3"
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
            className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeField({ type: "REMOVE_FIELD", tgtId: field.id, tgtKind: field.kind })}
          >
            Remove
          </button>
        </>
      );
  }
};

const FormLabelInput = ({ field, removeField, setValue, addOption }: formInputProps) => {
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
