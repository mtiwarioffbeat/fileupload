"use client";
import Modal from "./Modal";
import React, { useState } from "react";
import FileUploadBox from "./FileUploadbox";
import { useDispatch, useSelector } from "react-redux";
import { setEditFile, setShowModal } from "@/redux/FileSlice/FileSlice";
import { setShowBox } from "@/redux/AuthSlice/AuthSlice";
import Spinner from "./Spinner";
import '@/app/globals.css'

const Table = () => {
  const dispatch = useDispatch();
  const [deleteFile, setDeleteFile] = useState(false);
  const { files, showModal } = useSelector((store:any) => store.file);
  const { loading } = useSelector((store:any) => store.auth);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // total number of pages=====
  const totalPages = Math.ceil(files.length / itemsPerPage);

  // files for the current page====
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

  const handlePagination = (page:number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Download files
  const handleDownload = async (file:any) => {
    const response = await fetch(`${file.filepath}?download=true`);
    console.log("response",response)
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    console.log("URL", url)
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
      {showModal && <Modal deleteFile={deleteFile} />}

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
        {loading ? (
          <div className="d-flex align-items-center justify-content-center w-100 mt-5">
            <Spinner color='#000' />
          </div>
        ) : (
          currentFiles.length > 0 ? (
            currentFiles.map((file:any, index:number) => (
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
                      dispatch(setEditFile(file));
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
                  <button onClick={() => handleDownload(file)} className="btn btn-link p-0 text-success">
                    Download
                  </button>
                  <a href={file.filepath} target="_blank">view</a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-3">No files found</div>
          )
        )}
      </div>

      {/* Pagination controls */}
      {files.length > itemsPerPage && (
        <nav aria-label="Table pagination" className='mt-5 d-flex align-items-center justify-content-end'>
          <ul className="pagination">
            <li className={`page-item cursor-pointer ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
            </li>

            {[...Array(totalPages).keys()].map(number => (
              <li key={number} className={`page-item cursor-pointer ${currentPage === number + 1 ? 'active' : ''}`}>
                <button onClick={() => handlePagination(number + 1)} className="page-link">
                  {number + 1}
                </button>
              </li>
            ))}

            <li className={`page-item cursor-pointer ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Table;
