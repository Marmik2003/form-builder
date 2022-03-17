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
  kind: "dropdown";
  multiple?: boolean;
}

export type checkboxField = {
  id: Number;
  label: string;
  value?: boolean[];
  options: optionField[];
  type: "checkbox";
  kind: "checkbox";
}


export type radioField = {
  id: Number;
  label: string;
  value?: string;
  options: optionField[];
  type: "radio";
  kind: "radio";
}


export type formField = textField | selectField;
