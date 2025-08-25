"use client";
import Modal from "./Modal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FileUploadBox from "./FileUploadbox";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setEditFile, setShowModal } from "@/redux/FileSlice/FileSlice";
import { setShowBox } from "@/redux/AuthSlice/AuthSlice";
// const Table = ({ userfiles, fetchfiles, handleFileSubmit, showBox, setShowBox, file, isUploading, setFile }) => {
const Table = () => {
  // const [modal, setModal] = useState(false);
  const dispatch = useDispatch()
  // const [deleteFileName, setDeleteFileName] = useState(null);
  const [deleteFile, setDeleteFile] = useState(false)
  const [userfiles, setUserFiles] = useState([])
  const { files, showModal } = useSelector((store: any) => store.file)
  console.log('files:::', files)



  // useEffect(() => {
  //   fetchfiles();
  //   // setDeletedFile(false)
  // }, []);


  // Download files
  const handleDownload = async (file: any) => {
    const response = await fetch(`${file.filepath}?download=true`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {showModal ? (<Modal
        // show={modal}
        deleteFile={deleteFile}
      // deleteFileName={deleteFileName}
      // onConfirm={handleDeleteConfirm}
      />) : ("")}

      <FileUploadBox />
      <div className="container-fluid mt-4">
        {/* Heading Row */}
        <div className="row fw-semibold bg-light py-2 border-bottom d-none d-md-flex">
          <div className="col-md-3">File Name</div>
          <div className="col-md-3">File Type</div>
          <div className="col-md-3">Created At</div>
          <div className="col-md-3 text-end">Actions</div>
        </div>

        {/* Data Rows */}
        {files && files.length > 0 ? (
          files.map((file: any, index: number) => (
            <div key={index} className="row align-items-center py-2 border-bottom">
              <div className="col-12 col-md-3 fw-medium">{file.filename}</div>
              <div className="col-12 col-md-3 text-muted">{file.filetype}</div>
              <div className="col-12 col-md-3 text-muted">
                {new Date(file.created_at).toLocaleString()}
              </div>
              <div className="col-12 col-md-3 d-flex justify-content-md-end gap-3 mt-2 mt-md-0">
                <button
                  className="btn btn-link p-0 text-primary"
                  onClick={() => {
                    dispatch(setShowBox(true));
                   dispatch(setEditFile(file));;
                  }}
                >Edit</button>
                <button
                  className="btn btn-link p-0 text-danger"
                  onClick={() => {
                    setDeleteFile(file);
                    dispatch(setShowModal(true));
                  }}
                >
                  Delete
                </button>
                {/* <a
                  href={`${file.filepath}?download=true`}
                  className="btn btn-link p-0 text-success"
                  download={file.filename}
                >
                  Download
                </a> */}
                <button onClick={() => handleDownload(file)} className="btn btn-link p-0 text-success">
                  Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-3">No files found</div>
        )}
      </div>
    </>
  );
};

export default Table;
