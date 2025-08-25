import axios from "axios";
import { useDispatch } from "react-redux";
import { setFiles } from "@/redux/FileSlice/FileSlice";

// export default  async function fetchfiles (){
    
   
//   }

  const fetchfiles = async() => {
// const dispatch = useDispatch()
    const fileRes = await axios.get("/api/users/files");
    console.log("File list from backend:", fileRes.data);
    // dispatch(setFiles(fileRes.data));
    return fileRes.data
  }

  export default fetchfiles