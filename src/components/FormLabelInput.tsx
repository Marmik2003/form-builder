import React from 'react'
import { formField } from '../types/form';


interface formInputProps {
    field: formField;
    removeField: (field: formField) => void;
    value?: string;
    setValue: (field: formField, value: string) => void;
  }
  
  const renderInput = (
    field: formField,
    removeField: (field: formField) => void,
    setValue: (field: formField, value: string) => void
  ) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type={field.type}
            id={field.id.toString()}
            placeholder={field.label}
            value={field.label}
            onChange={(e) => setValue(field, e.target.value)}
            className="border border-gray-200 rounded p-2 w-full"
          />
        );
      case "checkbox":
        return (
          <input
            type={field.type}
            id={field.id.toString()}
            value={field.label}
            onChange={(e) => setValue(field, e.target.value)}
          />
        );
      case "radio":
        return (
          <input
            type={field.type}
            id={field.id.toString()}
            value={field.label}
            onChange={(e) => setValue(field, e.target.value)}
          />
        );
      default:
        return null;
    }
  };

const FormLabelInput = ({ field, removeField, setValue }: formInputProps) => {
  return (
    <div className="flex flex-col" key={field.id.toString()}>
      <label htmlFor={field.id.toString()}>{field.label}</label>
      <div className="flex gap-2">
        {renderInput(field, removeField, setValue)}
        <button
          type="button"
          className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => removeField(field)}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default FormLabelInput