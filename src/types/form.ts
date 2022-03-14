export interface formData {
  id: Number;
  title: string;
  formFields: formField[];
}

export interface formField {
  id: Number;
  label: string;
  value?: string;
  type: string;
  kind: string;
}
