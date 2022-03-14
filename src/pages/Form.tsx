import React, { useState, useEffect, useRef } from "react";
import { Link, navigate } from "raviger";

import { formData, formField } from "../types/form";
import { getInitialState, saveFormData } from "../utils/StorageUtils";

import FormLabelInput from "../components/FormLabelInput";

const newForm: formData = {
  id: Number(new Date()),
  title: "Untitled Form",
  formFields: [],
};

const Form = (props: { formId?: Number }) => {
  const [form, setForm] = useState(getInitialState(newForm, props.formId));
  const [newField, setNewField] = React.useState("");

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

  const removeField = (tgtField: formField) => {
    setForm((currentForm: formData) => {
      const newFields = currentForm.formFields.filter(
        (item) => item.id !== tgtField.id
      );
      return {
        ...currentForm,
        formFields: newFields,
      };
    });
  };

  const addField = () => {
    setForm(() => {
      return {
        ...form,
        formFields: [
          ...form.formFields,
          {
            id: Number(new Date()),
            label: newField,
            value: "",
            type: "text",
          },
        ],
      };
    });
    setNewField("");
  };

  const handleInputChange = (field: formField, value: string) => {
    setForm({
      ...form,
      formFields: form.formFields.map((item: formField) => {
        if (item.id === field.id) {
          return {...field, label: value};
        }
        return item;
      }),
    });
  };

  return (
    <div>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border border-gray-200 rounded p-2 w-full"
        ref={titleRef}
      />
      <div className="flex flex-col gap-4">
        {form.formFields.map((field: formField) => (
          <FormLabelInput
            field={field}
            removeField={removeField}
            key={field.id.toString()}
            setValue={handleInputChange}
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
            <button
              type="button"
              className="min-w-max bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={addField}
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
