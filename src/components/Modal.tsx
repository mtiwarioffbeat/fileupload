import { setFiles, setShowModal } from "@/redux/FileSlice/FileSlice";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Modal = ({deleteFile}:{deleteFile:any}) => {
// const Modal = () => {
//   if (!show) return null;
console.log("delete file",deleteFile)
const dispatch = useDispatch()
const {showModal} = useSelector((store:any)=>store.file)
console.log("showmodal value",showModal)

const fetchfiles= async()=> {
    const fileRes = await axios.get("/api/users/files");
    console.log("File list from backend:", fileRes.data);
    dispatch(setFiles(fileRes.data));
    return 
  }
  const handleDeleteConfirm = async () => {
    console.log("Delete confirmed for:", deleteFile);

    try {
      const res = await axios.delete("/api/users/files", {
        data: { file: deleteFile },
      });

      console.log("response", res.data);
      dispatch(setShowModal(false));
      fetchfiles()
      // setDeleteFileName(null);
      // setDeleteFile(true)
      // fetch()

    } catch (err) {
      console.error("Delete error:", err);
    }
  };


  return (
    <div>

   
    {showModal && (<div
      className="modal fade show d-block"
    //   tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Are you sure you want to delete this file?</h5>
            {/* <button type="button" className="btn-close" onClick={onClose}></button> */}
            <button type="button" className="btn-close"  onClick={()=>dispatch(setShowModal(false))}></button>
          </div>
          <div className="modal-body">
            {/* <p className="fs-4 fw-bold">{deleteFileName}</p> */}
            <p className="fs-4 fw-bold">{deleteFile.filename}</p>
          </div>
          <div className="modal-footer">
            {/* <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button> */}
             <button type="button" className="btn btn-secondary" onClick={()=>dispatch(setShowModal(false))} >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>)}
     </div>
  );
};

export default Modal;
