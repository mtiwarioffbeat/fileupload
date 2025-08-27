import { setLoading } from "@/redux/AuthSlice/AuthSlice";
import { setFiles } from "@/redux/FileSlice/FileSlice";
import axios from "axios";
import { useDispatch } from "react-redux";

export class UserService {
    public static async SignupUser(payload: any) {
        const formdata = {
            name: payload.fullName,
            email: payload.email,
            password: payload.password
        }
        try {
            const response = await axios.post('/api/auth/signup', { ...formdata })
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

    public static async FileSubmit(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await axios.post("/api/users/files", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return data;
    }


    


}

export const fetchfiles = async () => {
    try {
        const fileRes = await axios.get("/api/users/files");
        return fileRes.data
    } catch (err) {
        throw err
    }
}

export  const Logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
