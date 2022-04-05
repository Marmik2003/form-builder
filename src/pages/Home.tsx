import React, { useState, useEffect } from "react";
import { formData } from "../types/form";

import { useQueryParams } from "raviger";

import ListElement from "../components/ListElement";
import { Pagination, PaginationData } from "../types/common";
import { authenticateUser, deleteForm, listForms } from "../utils/APIMethods";
import Modal from "../components/Modal";
import CreateForm from "../components/CreateFormModal";
import LoadingComponent from "../components/LoadingComponent";
import PaginationContainer from "../components/PaginationContainer";

const fetchFormsData = async (
  setFormsData: React.Dispatch<React.SetStateAction<PaginationData<formData>>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  offset?: number,
  limit?: number
) => {
  try {
    if (setLoading) setLoading(true);
    const offsetValue: number = offset ? offset : 0;
    const limitValue: number = limit ? limit : 5;
    const data: Pagination<formData> = await listForms({
      offset: offsetValue,
      limit: limitValue,
    });

    setFormsData({
      results: data.results,
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

const Home = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState<PaginationData<formData>>({
    count: 0,
    prev: null,
    next: null,
    results: [],
    limit: 5,
    activePage: 0,
  });
  const [{ search }, setQueryParams] = useQueryParams();
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    authenticateUser().then((_) => fetchFormsData(setForms, setLoading));
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setQueryParams({ search: searchString });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  const handleDelete = (form: formData) => {
    deleteForm(form.id).then((_) => {
      setForms(forms => ({
        ...forms,
        results: forms.results.filter(f => f.id !== form.id),
      }))
    });
  };

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * forms.limit;
    fetchFormsData(setForms, setLoading, offset, forms.limit);
  }

  return (
    <>
      <div className="flex flex-wrap -mx-3 mb-6">
        {loading && <LoadingComponent />}
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-search"
          >
            Search
          </label>
          <input
            className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none"
            id="grid-search"
            name="search"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            type="search"
            placeholder="Search"
          />
        </div>
      </div>
      {forms.results.length > 0 &&
        forms.results
          .filter((f: formData) =>
            f.name.toLowerCase().includes(search?.trim().toLowerCase() || "")
          )
          .map((f: formData) => (
            <ListElement
              key={f.id.toString()}
              form={f}
              handleDelete={handleDelete}
            />
          ))}
      <PaginationContainer
        count={forms.count}
        limit={forms.limit}
        activePage={forms.activePage}
        onPageChange={handlePageChange}
      />
      <div className="my-4">
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded"
        >
          New Form
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <CreateForm />
      </Modal>
    </>
  );
};

export default Home;
