import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/AuthSlice/AuthSlice";
import fileReducer from "@/redux/FileSlice/FileSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    file: fileReducer, 
  
  },
});

export default store;




