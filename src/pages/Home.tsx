import React, { useState, useEffect } from "react";
import { formData } from "../types/form";

import { Link, useQueryParams } from "raviger";

import { getLocalForms } from "../utils/StorageUtils";
import ListElement from "../components/ListElement";

const Home = () => {
  const [{ search }, setQueryParams] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const [localForms, setLocalForms] = useState<formData[]>(getLocalForms());

  useEffect(() => {
    localStorage.setItem("savedForms", JSON.stringify(localForms));
  }, [localForms]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setQueryParams({ search: searchString });
    }, 300);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  const handleDelete = (form: formData) => {
    setLocalForms(localForms.filter((f) => f.id !== form.id));
  }

  return (
    <>
      <div className="flex flex-wrap -mx-3 mb-6">
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
      {localForms.length > 0 &&
        localForms
          .filter((f: formData) =>
            f.title.toLowerCase().includes(search?.trim().toLowerCase() || "")
          )
          .map((f: formData) => (
            <ListElement
              key={f.id.toString()}
              form={f}
              handleDelete={handleDelete}
            />
          ))}
      <div className="my-4">
        <Link
          href={`/form/0`}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded"
        >
          New Form
        </Link>
      </div>
    </>
  );
};

export default Home;
