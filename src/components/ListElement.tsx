import React from "react";
import { formData } from "../types/form";

import { Link } from "raviger";
import { faEdit, faEye, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


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
        <div className="flex columns-2 space-x-2">
          <Link
            href={`/preview/${props.form.id}`}
            className="w-full bg-blue-400 font-medium px-2 py-1 rounded-md text-white tracking-wide"
          >
            <FontAwesomeIcon icon={faEye} />
          </Link>
          <Link
            href={`/form/${props.form.id}`}
            className="w-full bg-teal-400 font-medium px-2 py-1 rounded-md text-white tracking-wide"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <button
            onClick={() => props.handleDelete(props.form)}
            className="w-full bg-red-500 font-medium px-2 py-1 rounded-md text-white tracking-wide"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListElement;
