import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShowBox, setFile } from "@/redux/AuthSlice/AuthSlice";
// const baseURL = '/api/auth'
import { createAsyncThunk } from "@reduxjs/toolkit";


export class UserService {
    public static async SignupUser(payload: any) {
        const formdata = {
            name: payload.fullName,
            email: payload.email,
            password: payload.password
        }
        try {
            console.log("payload:::", payload)
            // const response = await axios.post(baseURL+"/signup",formdata)
            const response = await axios.post('/api/auth/signup', {
                ...formdata
                // name: payload.fullName,
                // email: payload.email,
                // password: payload.password
            })
            // console.log("error in userservice",response)
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    public static async LoginUser(payload: any) {
        try {
            const response = await axios.post('/api/auth/login', {
                email: payload.email,
                password: payload.password
            })
            return response
        } catch (err: any) {
            throw err
        }
    }

    // public static async FileSubmit(file: File) {
    //     const dispatch = useDispatch()
    //     // const { file } = useSelector((store: any) => store.auth)
    //     if (!file) return alert("Please select a file first!");
    //     try {
    //         const res = await axios.post('/api/users/files', file, {
    //             headers: { 'Content-Type': "multipart/form-data" },
    //             withCredentials: true,
    //         });
    //         console.log("upload result:", res);

    //         dispatch(setFile(null));
    //         dispatch(setShowBox(false));
    //         return res
    //     } catch (error) {
    //         console.error(" error uploading file:", error);
    //     }

    // }

    public static async FileSubmit(file: File) {
        console.log("file", file)
      const formData = new FormData();
      console.log("Uploading file:", file.name);
    //  const dispatch = useDispatch()
      formData.append("file", file);

      const { data } = await axios.post("/api/users/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload response:", data);
    //   dispatch(setShowBox(false))
      return data; // { filename, filepath }
    }

}