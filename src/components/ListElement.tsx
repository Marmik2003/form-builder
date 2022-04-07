import React from "react";
import { formData } from "../types/form";

import { Link } from "raviger";
import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListDropdown from "./ListDropdown";
import { faList } from "@fortawesome/free-solid-svg-icons";


const ListElement = (props: {form: formData, handleDelete: (form: formData) => void}) => {
  return (
    <div className="flex">
      <div className="bg-slate-100 flex w-full justify-between items-center p-4 rounded-xl mt-4">
        <div className="flex justify-start items-center gap-2">
          <div>
            <p className="text-gray-700 text-lg font-medium tracking-wider">
              <span className="">{props.form.name}</span>
            </p>
          </div>
        </div>
        <div>
          <div className="hidden lg:flex columns-2 space-x-1">
            <Link
              href={`/submissions/${props.form.id}`}
              className="w-full bg-lime-500 font-medium px-2 py-1 rounded-md text-white tracking-wide"
              title="Submissions"
            >
              <FontAwesomeIcon icon={faList} />
            </Link>
            <Link
              href={`/preview/${props.form.id}`}
              className="w-full bg-blue-400 font-medium px-2 py-1 rounded-md text-white tracking-wide"
              title="Preview"
            >
              <FontAwesomeIcon icon={faEye} />
            </Link>
            <Link
              href={`/form/${props.form.id}`}
              className="w-full bg-teal-400 font-medium px-2 py-1 rounded-md text-white tracking-wide"
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Link>
            <button
              onClick={() => props.handleDelete(props.form)}
              className="w-full bg-red-500 font-medium px-2 py-1 rounded-md text-white tracking-wide"
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
          <ListDropdown>
            <Link
              href={`/submissions/${props.form.id}`}
              className="group flex space-x-2 items-center w-full px-2 py-2 text-sm"
              title="Preview"
            >
              <FontAwesomeIcon className="px-2" icon={faList} /> View Submissions 
            </Link>
            <Link
              href={`/preview/${props.form.id}`}
              className="group flex space-x-2 items-center w-full px-2 py-2 text-sm"
              title="Preview"
            >
              <FontAwesomeIcon className="px-2" icon={faEye} /> Preview 
            </Link>
            <Link
              href={`/form/${props.form.id}`}
              className="group flex space-x-2 items-center w-full px-2 py-2 text-sm"
              title="Edit"
            >
              <FontAwesomeIcon className="px-2" icon={faEdit} /> Edit
            </Link>
            <button
              onClick={() => props.handleDelete(props.form)}
              className="group flex space-x-2 items-center w-full px-2 py-2 text-sm"
              title="Delete"
            >
              <FontAwesomeIcon className="px-2" icon={faTrashAlt} /> Delete
            </button>
          </ListDropdown>
        </div>
      </div>
    </div>
  );
};

export default ListElement;
