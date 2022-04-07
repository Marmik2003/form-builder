import { Pagination, PaginationData } from "../types/common";
import { formData } from "../types/form";
import { submissionData } from "../types/submission";
import { listForms, getSubmissions } from "./APIMethods";

export const fetchFormData = async (
  setFormsData: React.Dispatch<React.SetStateAction<PaginationData<formData>>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  offset?: number,
  limit?: number,
  forms?: PaginationData<formData>
) => {
  try {
    if (setLoading) setLoading(true);
    const offsetValue: number = offset ? offset : 0;
    const limitValue: number = limit ? limit : 10;
    const data: Pagination<formData> = await listForms({
      offset: offsetValue,
      limit: limitValue,
    });

    setFormsData({
      results: forms ? forms.results.concat(data.results) : data.results,
      count: data.count,
      prev: data.prev,
      next: data.next,
      limit: limitValue,
      activePage: offsetValue ? offsetValue / limitValue + 1 : 1,
    });
  } catch (error) {
    console.error(error);
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const fetchSubmissions = async (
  formId: Number,
  setSubmissionsData: React.Dispatch<React.SetStateAction<PaginationData<submissionData>>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  offset?: number,
  limit?: number,
  submissions?: PaginationData<submissionData>
) => {
  try {
    if (setLoading) setLoading(true);
    const offsetValue: number = offset ? offset : 0;
    const limitValue: number = limit ? limit : 10;
    const data: Pagination<submissionData> = await getSubmissions(formId, {
      offset: offsetValue,
      limit: limitValue,
    });

    setSubmissionsData({
      results: submissions ? submissions.results.concat(data.results) : data.results,
      count: data.count,
      prev: data.prev,
      next: data.next,
      limit: limitValue,
      activePage: offsetValue ? offsetValue / limitValue + 1 : 1,
    });
  } catch (error) {
    console.error(error);
  } finally {
    if (setLoading) setLoading(false);
  }
}
