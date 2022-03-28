export type formData = {
  id: Number;
  title: string;
  formFields: formField[];
}

export type textFieldTypes = "text" | "number" | "date" | "time" | "email" | "url" | "textarea" | "password";

export type textField = {
  id: Number;
  label: string;
  value?: string;
  type: textFieldTypes;
  kind: "text";
}

export type optionField = {
  value: string;
  text: string;
}

export type selectField = {
  id: Number;
  label: string;
  value?: string | string[];
  options: optionField[];
  type: "select";
  kind: "dropdown" | "radio";
  multiple?: boolean;
  is_tickable?: boolean;
}


export type formField = textField | selectField;
