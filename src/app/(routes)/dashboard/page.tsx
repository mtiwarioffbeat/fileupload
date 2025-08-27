"use client";
import React, {  useEffect, useRef } from "react";
import { FaUpload} from "react-icons/fa";
import FileUploadBox from "@/components/FileUploadbox";
import { setLoading, setShowBox } from "@/redux/AuthSlice/AuthSlice";
import { useDispatch } from "react-redux";
import Table from "@/components/Table";

const Page = () => {
  const dispatch = useDispatch()
  
  return (
    <div>
      {/* Header */}
      <div className="w-75 mx-auto mt-5">
        <div className="d-md-flex align-items-center justify-content-between">
          <div>
            <h2 className="text-primary">Let's build something new!</h2>
            <span className="px-1 fs-6">
              To upload a new file, simply click on the upload button to save your
              file in one click!
            </span>
          </div>

          {/* Upload Button */}
          <div className="mt-3">
            <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => dispatch(setShowBox(true))}
              >
                <FaUpload />
                Upload
              </button>
          </div>
        </div>

        {/* Modal Upload Box */}
        <FileUploadBox/>
        <Table/>
     
      </div>
    </div>
  );
};

export default Page;
