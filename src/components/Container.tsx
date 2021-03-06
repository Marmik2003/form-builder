import React from "react";
import { ToastContainer } from "react-toastify";
import Header from "./Header";

const Container = (props: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex w-screen min-h-screen overflow-auto bg-gray-100 items-center px-3">
        <div className="flex w-full mx-auto md:w-2/3 lg:w-1/2">
          <div className="w-full bg-white shadow-lg rounded-xl mx-2 p-4">
            <Header />
            {props.children}
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
};

export default Container;
