import { navigate } from "raviger";
import { toast } from "react-toastify";
import { PaginationParams } from "../types/common";
import {  formField, formData, optionField } from "../types/form";

const API_BASE_URL = "https://typeform-builder.herokuapp.com/api/";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const authenticateUser = async () => {
    me().catch(() => {
        toast.error("Please login to continue", {
            type: toast.TYPE.ERROR,
        });
        navigate("/login");
        throw new Error("User not logged in");
    })
}

export const request = async (endpoint: string, method: RequestMethod = "GET", data: any = {}) => {
    let url, body;
    if(method === "GET") {
        const requestParams = data ? `?${Object.keys(data).map(key => `${key}=${data[key]}`).join("&")}` : "";
        url = `${API_BASE_URL}${endpoint}${requestParams}`;
        body = null;
    } else {
        url = `${API_BASE_URL}${endpoint}`;
        body = data ? JSON.stringify(data) : null;
    }

    const token = localStorage.getItem("token");
    const auth = token ? `Token ${localStorage.getItem("token")}` : "";

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: auth 
        },
        body
    });

    if(response.ok) {
        if(method === "DELETE") return "true";

        const json = await response.json();
        return json;
    } else {
        const errorJson = await response.json();
        throw new Error(errorJson.non_field_errors);
    }
}

export const login = (username: string, password: string) => {
    return request('auth-token/', 'POST', {username, password});
}

export const me = () => {
    return request('users/me/', 'GET', {});
}

export const createForm = (form: formData) => {
    return request('forms/', 'POST', form);
}

export const listForms = (pageParams: PaginationParams) => {
    return request('forms/', 'GET', pageParams);
}

export const getFormData = (formId: Number) => {
    return request(`forms/${formId}/`, 'GET')
}

export const updateFormData = (formId: Number, formData: formData) => {
    return request(`forms/${formId}/`, 'PUT', formData);
}

export const deleteForm = (formId: Number) => {
    return request(`forms/${formId}/`, 'DELETE');
}

export const getFormFields = (formId: Number) => {
    return request(`forms/${formId}/fields/`, 'GET');
}

export const addField = (formId: Number, field: formField) => {
    return request(`forms/${formId}/fields/`, 'POST', field);
}

export const updateField = (formId: Number, fieldId: Number, field: formField) => {
    return request(`forms/${formId}/fields/${fieldId}/`, 'PUT', field);
}

export const removeField = (formId: Number, fieldId: Number) => {
    return request(`forms/${formId}/fields/${fieldId}/`, 'DELETE');
}

export const getOptions = (formId: Number, fieldId: Number) => {
    return request(`forms/${formId}/fields/${fieldId}/options/`, 'GET');
}

export const addOption = (formId: Number, fieldId: Number, option: optionField) => {
    return request(`forms/${formId}/fields/${fieldId}/options/`, 'POST', option);
}

export const updateOption = (formId: Number, fieldId: Number, optionId: Number, option: optionField) => {
    return request(`forms/${formId}/fields/${fieldId}/options/${optionId}/`, 'PUT', option);
}

export const removeOption = (formId: Number, fieldId: Number, optionId: Number) => {
    return request(`forms/${formId}/fields/${fieldId}/options/${optionId}/`, 'DELETE');
}

export const submitForm = (formId: Number, formFields: { fields: { field: Number, value:string }[]}) => {
    return request(`forms/${formId}/submissions/`, 'POST', formFields);
}

export const getSubmissions = (formId: Number, pageParams?: PaginationParams) => {
    return request(`forms/${formId}/submissions/`, 'GET', pageParams);
}

export const getSubmission = (formId: Number, submissionId: Number) => {
    return request(`forms/${formId}/submissions/${submissionId}/`, 'GET');
}
