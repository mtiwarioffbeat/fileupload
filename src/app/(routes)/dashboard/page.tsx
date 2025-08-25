"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaUpload} from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
// import { useUploadThing } from "@/utils/uploadthing";
// import axios from "axios";
// import Table from "@/components/Table";
// import Spinner from "@/components/Spinner";
import FileUploadBox from "@/components/FileUploadbox";
import { setShowBox } from "@/redux/AuthSlice/AuthSlice";
import { useDispatch, UseDispatch,useSelector } from "react-redux";
import Table from "@/components/Table";
const Page = () => {
  const { showBox } = useSelector((store: any) => store.auth)
  const dispatch = useDispatch()
//   const [showBox, setShowBox] = useState(false);
  const [file, setFile] = useState(null);
//   const [userfiles, setUserFiles] = useState([]);

//   const { startUpload, isUploading } = useUploadThing("imageUploader");
  const fileInputRef = useRef<HTMLInputElement>(null);


//   async function fetchfiles() {
//     const fileRes = await axios.get("/api/users/files");
//     console.log("File list from backend:", fileRes.data);
//     setUserFiles(fileRes.data);
//   }

//   const handleFileSubmit = async () => {
//     if (!file) return alert("Please select a file first!");
//     try {
//       const res = await startUpload([file]);
//       console.log("upload result:", res);

//       setFile(null);
//       setShowBox(false); // close modal after upload
//     } catch (error) {
//       console.error(" error uploading file:", error);
//     }
//   };

//   useEffect(() => {
//     fetchfiles();
//   }, [file]);

  return (
    <div>
      {/* Header */}
      <div className="w-75 mx-auto mt-5">
        <div className="d-flex align-items-center justify-content-between">
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
        {/* <FileUploadBox handleFileSubmit={()FileSubmit} showBox={showBox} setShowBox={setShowBox} file={file} isUploading={isUploading} setFile={setFile}/> */}

        {/* Show Table or Spinner */}
        {/* {userfiles.length > 0 ? (
          <Table userfiles={userfiles} fetchfiles={fetchfiles} handleFileSubmit={handleFileSubmit} showBox={showBox} setShowBox={setShowBox} file={file} isUploading={isUploading} setFile={setFile}/>
        ) : (
          <div className="">

          <Spinner color="#000" />
          </div>
        )} */}
        <Table/>
      </div>
    </div>
  );
};

export default Page;
