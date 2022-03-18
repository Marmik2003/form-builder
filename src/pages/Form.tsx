import React, { useState, useEffect, useRef } from "react";
import { Link, navigate } from "raviger";

import { formData, formField,optionField, selectField, textField, textFieldTypes } from "../types/form";
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
  const [fieldType, setFieldType] = React.useState<textFieldTypes | "select" | "multiselect">("text");

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

  const removeField = (tgtField: formField, tgtValue?: string) => {
    if (tgtValue !== undefined && tgtField.kind === "dropdown") {
      setForm((formVal : formData) => {
        return {
          ...form,
          formFields: form.formFields.map((item: selectField) => {
            if (item.id === tgtField.id) {
              item.options = item.options.filter((option: optionField) => option.value !== tgtValue);
            }
            return item;
          }),
        };
      });
    } else {
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
  };

  const addField = () => {
    setForm((form: formData) => {
      switch (fieldType) {
        case "select":
          return {
            ...form,
            formFields: [
              ...form.formFields,
              {
                id: Number(new Date()),
                label: newField,
                type: fieldType,
                options: [],
                kind: "dropdown",
              },
            ],
          };
        case "multiselect": 
          return {
            ...form,
            formFields: [
              ...form.formFields,
              {
                id: Number(new Date()),
                label: newField,
                type: "select",
                kind: "dropdown",
                options: [],
                multiple: true,
              },
            ],
          };
        default:
          return {
            ...form,
            formFields: [
              ...form.formFields,
              {
                id: Number(new Date()),
                label: newField,
                value: "",
                type: fieldType,
                kind: "text",
              },
            ],
          };
      }
    });
    setNewField("");
  };

  const handleTextInputChange = (field: formField, value: string, optVal?: string) => {
    if (optVal !== undefined && field.kind === "dropdown") {
      setForm((form: formData) => {
        return {
          ...form,
          formFields: form.formFields.map((item: formField) => {
            if (typeof field == typeof item && item.id === field.id) {
              return {
                ...item,
                options: (item as selectField).options.map((opt: optionField) => {
                  if (opt.value === value) {
                    opt.text = optVal;
                  }
                  return opt;
                }),
              };
            }
            return item;
          }),
        };
      });
    } else {
      setForm({
        ...form,
        formFields: form.formFields.map((item: formField) => {
          if (item.id === field.id) {
            return {...field, label: value};
          }
          return item;
        }),
      });
    }
  };

  const addOption = (field: selectField) => {
    setForm((form: formData) => {
      return {
        ...form,
        formFields: form.formFields.map((item: selectField | textField) => {
          if (typeof item === typeof field && item.id === field.id) {
            return {
              ...item,
              options: [
                ...(item as selectField).options,
                {
                  value: Number(new Date()).toString(),
                  text: "",
                },
              ],
            };
          }
          return item;
        }),
      };
    });
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
    }
  ];

  return (
    <div>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border border-gray-200 rounded p-2 w-full border-b-2 mb-4"
        ref={titleRef}
      />
      <div className="flex flex-col gap-4">
        {form.formFields.map((field: formField) => (
          <FormLabelInput
            field={field}
            removeField={removeField}
            key={field.id.toString()}
            setValue={handleTextInputChange}
            addOption={addOption}
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
