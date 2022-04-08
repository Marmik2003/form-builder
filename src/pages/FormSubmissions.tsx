import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, navigate } from "raviger";
import React, { Key, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import Loading from "../components/LoadingComponent";
import { PaginationData } from "../types/common";
import { submissionData } from "../types/submission";
import { authenticateUser } from "../utils/APIMethods";
import { fetchSubmissions } from "../utils/PaginationUtils";

const FormSubmissions = (props: { formId: Number }) => {
  const [loading, setLoading] = useState(true);
  const [formSubmissions, setFormSubmissions] = useState<
    PaginationData<submissionData>
  >({
    count: 0,
    prev: null,
    next: null,
    results: [],
    limit: 10,
    activePage: 0,
  });

  useEffect(() => {
    authenticateUser()
      .then((_) => {
        fetchSubmissions(props.formId, setFormSubmissions, setLoading);
      })
      .catch((_) => {
        toast("You are not authorized to view this page", {
          type: toast.TYPE.ERROR,
        })
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.formId]);

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * formSubmissions.limit;
    fetchSubmissions(
      props.formId,
      setFormSubmissions,
      undefined,
      offset,
      formSubmissions.limit,
      formSubmissions
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <InfiniteScroll
            dataLength={formSubmissions.results.length}
            next={() => handlePageChange(formSubmissions.activePage + 1)}
            hasMore={formSubmissions.next !== null}
            loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          >
            {formSubmissions.results.map((submission) => (
              <div
                key={submission.id as Key}
                className=" flex w-full items-center gap-2 rounded-lg p-2"
              >
                <div className="w-full">
                  <span className="block">{submission.form.name}</span>
                  <span className="block text-sm text-gray-500">
                    Attempt Id: {submission.id} | Form Id: {submission.form.id}
                  </span>
                </div>

                <Link
                  className="bg-blue-400 font-medium px-2 py-1 rounded-md text-white tracking-wide"
                  href={`/preview/${submission.form.id}/${submission.id}`}
                  title="View Submission"
                >
                  <FontAwesomeIcon
                    icon={faEye}
                  />
                </Link>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default FormSubmissions;
