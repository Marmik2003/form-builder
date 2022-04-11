export type formData = {
  id: number,
  name: string,
  formFields: formField[],
  description: string,
  is_public?: boolean,
  created_by?: number,
  created_date?: Date,
  modified_date?: Date
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
  id: Number;
  value?: string;
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
