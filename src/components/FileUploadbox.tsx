"use client"
import React, { useState, useRef, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { setLoading, setShowBox } from "@/redux/AuthSlice/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchfiles, UserService } from "@/services/UserService";
import { setFiles, setEditFile } from "@/redux/FileSlice/FileSlice";

const FileUploadBox = () => {
  const { showBox, loading } = useSelector((store: any) => store.auth)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch()
  const { editFile } = useSelector((store: any) => store.file)
  const [imgpreview, setImagePreview] = useState<string>()
  const [selectFile, setSelectFile] = useState<any>(null)
  const [fileisempty, setFileIsEmpty] = useState<boolean>(false)
  useEffect(() => {
    dispatch(setLoading(true))
    async function fetchingfiles() {
      const data = await fetchfiles()
      dispatch(setFiles(data))
      dispatch(setLoading(false))

    }
    fetchingfiles()
  }, [])


  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    const url = URL.createObjectURL(selectedFile)
    setImagePreview(url)
    setSelectFile(selectedFile)
  };




  const handleSubmit = async () => {
    const formData = new FormData();
   
    if (selectFile == null) {
      setFileIsEmpty(true)
      return 
    }
    dispatch(setLoading(true))

    try {
      if (editFile) {
        formData.append("file", selectFile);
        formData.append("oldFileId", editFile.id)
        const update = await axios.put('/api/users/files', formData, {
          headers: { 'Content-Type': "multipart/form-data" },
          withCredentials: true,
        });

        dispatch(setLoading(true))

        // refresh
        const data = await fetchfiles()
        dispatch(setFiles(data))
        dispatch(setLoading(false))

        dispatch(setShowBox(false));
        dispatch(setEditFile(null));
        setSelectFile(null)
        return
      }


      dispatch(setLoading(true))
      const data: any = await UserService.FileSubmit(selectFile);

      if (data) {
        dispatch(setShowBox(false));
        dispatch(setEditFile(null))
        const filesA = await fetchfiles()
        setSelectFile(null)
        dispatch(setFiles(filesA))
        dispatch(setLoading(false))
      }
    } catch (err) {
      console.log("error while file upload", err);
    }
  };
  return (
    <div>
      {showBox && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
          role="dialog"
          onClick={() => dispatch(setShowBox(false))}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} //prevent backdrop click
          >
            <div className="modal-content p-4 text-center">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center justify-content-center gap-2">

                  <h5 className="mb-0">{editFile ? "Edit File: " : "Upload File"}</h5>
                  <span>{editFile?.filename}</span>
                </div>
                <RxCross1
                  className="text-black fs-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch(setShowBox(false))
                    dispatch(setEditFile(null))
                    setFileIsEmpty(false)
                  }}
                />
              </div>

              <div
                className="border rounded p-4 d-flex flex-column align-items-center justify-content-center"
                style={{ height: "15rem", cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectFile ? (
                  <div className="d-flex flex-column align-items-center gap-2">
                    <div>
                      <strong>{selectFile?.name} </strong>
                      <RxCross1

                        className=""
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectFile(null)
                          // dispatch(setEditFile(null))
                          setFileIsEmpty(false)
                        }}
                      />
                    </div>

                    <img src={imgpreview} width={100} />
                  </div>
                ) : (
                  <div className="d-flex flex-column align-items-center">
                    <FaFileUpload size={75} />
                    {fileisempty ? (<span className="mt-2 text-danger">
                      Please select a file
                    </span>):(<span className="mt-2 text-primary">
                      Click here to select a file
                    </span>)}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              <div className="mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setSelectFile(null)
                    dispatch(setShowBox(false))
                    dispatch(setEditFile(null))
                    setFileIsEmpty(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting.." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadBox;
