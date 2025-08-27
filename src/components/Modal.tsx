import { setLoading } from "@/redux/AuthSlice/AuthSlice";
import { setFiles, setShowModal } from "@/redux/FileSlice/FileSlice";
import { fetchfiles } from "@/services/UserService";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Modal = ({ deleteFile }: { deleteFile: any }) => {
  const dispatch = useDispatch()
  const { showModal } = useSelector((store: any) => store.file)


  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.delete("/api/users/files", {
        data: { file: deleteFile },
      });
      dispatch(setShowModal(false));
      dispatch(setLoading(true))
      const data = await fetchfiles()
      dispatch(setFiles(data))
      dispatch(setLoading(false))

    } catch (err) {
        throw err
    }
  };


  return (
    <div>
      {showModal && (<div
        className="modal fade show d-block"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Are you sure you want to delete this file?</h5>
              <button type="button" className="btn-close" onClick={() => dispatch(setShowModal(false))}></button>
            </div>
            <div className="modal-body">
              <p className="fs-4 fw-bold">{deleteFile.filename}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => dispatch(setShowModal(false))} >
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
