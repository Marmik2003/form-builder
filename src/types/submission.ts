import { formField } from "./form";

export type submissionData = {
  id: Number;
  form: {
    id: Number;
    name: string;
    description: string;
  };
  fields: {
    id: Number;
    field: formField;
    value: string;
  }
};
