import React from "react";
import { formField, optionField, selectField } from "../types/form";

interface formInputProps {
  field: formField;
  removeField: (field: formField) => void;
  value?: string;
  setValue: (field: formField, value: string) => void;
  addOption: (field: selectField) => void;
}

const renderInput = (
  field: formField,
  removeField: (field: formField, value?: string) => void,
  setValue: (field: formField, value: string, text?: string) => void,
  addOption: (field: selectField) => void,
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
            onChange={(e) => setValue(field, e.target.value)}
            className="border border-gray-200 rounded p-2 w-full"
          />
          <button
            type="button"
            className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeField(field)}
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
              onChange={(e) => setValue(field, e.target.value)}
              className="border border-gray-200 rounded p-2 w-full"
            />
            <button
              type="button"
              className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => removeField(field)}
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
                onChange={(e) => setValue(field, option.value, e.target.value)}
                className="border border-gray-200 rounded p-2 w-full"
              />
              <button
                type="button"
                className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => removeField(field, option.value)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mb-3"
            onClick={() => addOption(field)}
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
            onChange={(e) => setValue(field, e.target.value)}
            className="border border-gray-200 rounded p-2 w-full"
          />
          <button
            type="button"
            className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => removeField(field)}
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
      <label className="pb-2" htmlFor={field.id.toString()}>{field.label} ({field.type}{(field as selectField).multiple && " - multiple"})</label>
      <div className="flex gap-2">
        {renderInput(field, removeField, setValue, addOption)}
      </div>
    </div>
  );
};

export default FormLabelInput;
